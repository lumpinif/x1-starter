import * as Sentry from "@sentry/nextjs";
import { setupAnalytics } from "@x1-starter/analytics/server";
import { ratelimit } from "@x1-starter/kv/ratelimit";
import { logger } from "@x1-starter/logger";
import { getUser } from "@x1-starter/supabase/queries";
import { supabaseServerClient } from "@x1-starter/supabase/server";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

class ActionError extends Error {}

const handleServerError = (e: Error) => {
  console.error("Action error:", e.message);

  if (e instanceof ActionError) {
    return e.message;
  }

  return DEFAULT_SERVER_ERROR_MESSAGE;
};

export const actionClient = createSafeActionClient({
  handleServerError,
});

export const actionClientWithMeta = createSafeActionClient({
  handleServerError,
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      track: z
        .object({
          event: z.string(),
          channel: z.string(),
        })
        .optional(),
    });
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  const startTime = performance.now();

  // Here we await the action execution.
  const result = await next({ ctx: {} });

  const endTime = performance.now();

  if (process.env.NODE_ENV === "development") {
    logger.info(`Input -> ${JSON.stringify(clientInput)}`);
    logger.info(`Result -> ${JSON.stringify(result.data)}`);
    logger.info(`Metadata -> ${JSON.stringify(metadata)}`);
    console.log("Action execution took", endTime - startTime, "ms");

    // And then return the result of the awaited action.
    return result;
  }

  return result;
});

// AuthActionClient defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client will also be used for this one.
export const authActionClient = actionClientWithMeta
  // Define rate limiting middleware.
  .use(async ({ next, metadata }) => {
    const ip = headers().get("x-forwarded-for");

    const { success, remaining } = await ratelimit.limit(
      `${ip}-${metadata.name}`,
    );

    if (!success) {
      throw new Error("Too many requests");
    }

    return next({
      ctx: {
        ratelimit: {
          remaining,
        },
      },
    });
  })
  .use(async ({ next, metadata }) => {
    const {
      data: { user },
    } = await getUser();
    const supabase = supabaseServerClient();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (metadata) {
      const analytics = await setupAnalytics({
        userId: user.id,
      });

      if (metadata.track) {
        analytics.track(metadata.track);
      }
    }

    return Sentry.withServerActionInstrumentation(metadata.name, async () => {
      return next({
        ctx: {
          supabase,
          user,
        },
      });
    });
  });
