# Using environment variables

Environment variable inputs are a vital part of your applications that you'll need to account for in your Turborepo configuration.

There are three important questions when working with environment variables in Turborepo:

1. Are my environment variables accounted for in the task hash?
2. Which Environment Mode will turbo use?
3. Have I handled my .env files?

Failing to account for environment variables in your configuration can result in shipping your application with the wrong configuration. This can cause serious issues like shipping your preview deployments to production.

Good to know: Turborepo also uses System Environment Variables to configure its own behavior. Below, you'll find information about environment variables for your task's runtime and how they affect task hashing.

# Adding environment variables to task hashes

Turborepo needs to be aware of your environment variables to account for changes in application behavior. To do this, use the env and globalEnv keys in your turbo.json file.

./turbo.json

{
  "globalEnv": ["IMPORTANT_GLOBAL_VARIABLE"],
  "tasks": {
    "build": {
      "env": ["MY_API_URL", "MY_API_KEY"]
    }
  }
}
globalEnv: Changes to the values of any environment variables in this list will change the hash for all tasks.
env: Includes changes to the values of environment variables that affect the task, allowing for better granularity. For example, a lint task probably doesn't need to miss cache when the value of API_KEY changes, but a build task likely should.
Good to know:Turborepo supports wildcards for environment variables so you can easily account for all environment variables with a given prefix. Visit the API reference for env for more.
Framework Inference

Turborepo automatically adds prefix wildcards to your env key for common frameworks. If you're using one of the frameworks below in a package, you don't need to specify environment variables with these prefixes:

Framework	env wildcards
Astro	PUBLIC_*
Blitz	NEXT_PUBLIC_*
Create React App	REACT_APP_*
Gatsby	GATSBY_*
Next.js	NEXT_PUBLIC_*
Nitro	NITRO_*
Nuxt.js	NUXT_*, NITRO_*
RedwoodJS	REDWOOD_ENV_*
Sanity Studio	SANITY_STUDIO_*
Solid	VITE_*
SvelteKit	VITE_*, PUBLIC_*
Vite	VITE_*
Vue	VUE_APP_*
Good to know:Framework inference is per-package.
If you'd like to opt out of Framework Inference, you can do so by:

Running your tasks with --framework-inference=false
Adding a negative wildcard to the env key (for example, "env": ["!NEXT_PUBLIC_*"])
Environment Modes

Turborepo's Environment Modes allow you to control which environment variables are available to a task at runtime:

## Strict Mode (Default)

Filter environment variables to only those that are specified in the env and globalEnv keys in turbo.json.

## Loose Mode

Allow all environment variables for the process to be available.

### Strict Mode

Strict Mode filters the environment variables available to a task's runtime to only those that are specified in the globalEnv and env keys in turbo.json.

This means that tasks that do not account for all of the environment variables that they need are likely to fail. This is a good thing, since you don't want to cache a task that can potentially have different behavior in a different environment.

Cache safety with Strict Mode

While Strict Mode makes it much more likely for your task to fail when you haven't accounted for all of your environment variables, it doesn't guarantee task failure. If your application is able to gracefully handle a missing environment variable, you could still successfully complete tasks and get unintended cache hits.

Passthrough variables
In advanced use cases, you may want to make some environment variables available to a task without including them in the hash. Changes to these variables don't affect task outputs but still need to be available for the task to run successfully.

For these cases, add those environment variables to globalPassThroughEnv and passThroughEnv.

CI vendor compatibility
Strict Mode will filter out environment variables that come from your CI vendors until you've accounted for them using env, globalEnv, passThroughEnv, or globalPassThroughEnv.

If any of these variables are important to your tasks and aren't included by Framework Inference, make sure they are in your turbo.json configuration.

### Loose Mode

Loose Mode does not filter your environment variables according to your globalEnv and env keys. This makes it easier to get started with incrementally migrating to Strict Mode.

Use the --env-mode flag to enable Loose Mode on any invocation where you're seeing environment variables cannot be found by your scripts:

Terminal

turbo run build --env-mode=loose
As long as the environment variable is available when turbo is ran, your script will be able to use it. However, this also lets you accidentally forget to account for an environment variable in your configuration much more easily, allowing the task to hit cache when it shouldn't.

For example, you may have some code in your application that fetches data from an API, using an environment variable for the base URL:

./apps/web/data-fetcher.ts

const data = fetch(`${process.env.MY_API_URL}/resource/1`);
You then build your application using a value for MY_API_URL that targets your preview environment. When you're ready to ship your application, you build for production and see a cache hit - even though the value of the MY_API_URL variable has changed! MY_API_URL changed - but Turborepo restored a version of your application from cache that uses the preview environment's MY_API_URL rather than production's.

When you're using Loose Mode, MY_API_URL is available in the task runtime even though it isn't accounted for in the task hash. To make this task more likely to fail and protect you from this misconfiguration, we encourage you to opt for Strict Mode.

Handling .env files

.env files are great for working on an application locally. Turborepo does not load .env files into your task's runtime, leaving them to be handled by your framework, or tools like dotenv.

However, it's important that turbo knows about changes to values in your .env files so that it can use them for hashing. If you change a variable in your .env files between builds, the build task should miss cache.

To do this, add the files to the inputs key:

./turbo.json

{
  "globalDependencies": [".env"], // All task hashes
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", ".env", ".env.local"] // Only the `build` task hash
    }
  }
}
.env files can load variables into the task runtime even when the environment variables have not been added to the env key. Ensure that you add your environment variables for your builds the env key for CI and production builds.

Best practices

## Use .env files in packages

Using a .env file at the root of the repository is not recommended. Instead, we recommend placing your .env files into the packages where they're used.

This practice more closely models the runtime behavior of your applications since environment variables exist in each application's runtime individually. Additionally, as your monorepo scales, this practice makes it easier to manage each application's environment, preventing environment variable leakage across applications.

Good to know:You may find it easier to use a root .env file when incrementally migrating to a monorepo. Tools like dotenv can load .env files from different locations.

## Use eslint-config-turbo

The eslint-config-turbo package helps you find environment variables that are used in your code that aren't listed in your turbo.json. This helps ensure that all your environment variables are accounted for in your configuration.

## Avoid creating or mutating environment variables at runtime

Turborepo hashes the environment variables for your task at the beginning of the task. If you create or mutate environment variables during the task, Turborepo will not know about these changes and will not account for them in the task hash.

For instance, Turborepo will not be able to detect the inline variable in the example below:

./apps/web/package.json

{
  "scripts": {
    "dev": "export MY_VARIABLE=123 && next dev"
  }
}
MY_VARIABLE is being added to the environment after the dev task has started, so turbo will not be able to use it for hashing.

# Examples

Examples
Below are examples of proper environment variable configuration for a few popular frameworks:

Next.js
The turbo.json below expresses:

The build and dev tasks will have different hashes for changes to MY_API_URL and MY_API_KEY.
The build and dev tasks use the same file loading order as Next.js, with .env having the most precedence.
The test task does not use environment variables, so the env key is omitted. (Depending on your testing structure, your test task may need an env key.)

```json
./turbo.json
{
  "tasks": {
    "build": {
      "env": ["MY_API_URL", "MY_API_KEY"],
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env"
      ]
    },
    "dev": {
      "inputs": [
        "$TURBO_DEFAULT$",
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env"
      ]
    },
    "test": {}
  }
}
```

# Troubleshooting

## Use --summarize

The --summarize flag can be added to your turbo run command to produce a JSON file summarizing data about your task. Checking the diff for the globalEnv and env key can help you identify any environment variables that may be missing from your configuration.
