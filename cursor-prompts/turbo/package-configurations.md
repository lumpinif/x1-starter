API reference
Package Configurations
Many monorepos can declare a turbo.json in the root directory with a task description that applies to all packages. But, sometimes, a monorepo can contain packages that need to configure their tasks differently.

To accommodate this, Turborepo enables you to extend the root configuration with a turbo.json in any package. This flexibility enables a more diverse set of apps and packages to co-exist in a Workspace, and allows package owners to maintain specialized tasks and configuration without affecting other apps and packages of the monorepo.

How it works
To override the configuration for any task defined in the root turbo.json, add a turbo.json file in any package of your monorepo with a top-level extends key:

./apps/my-app/turbo.json

{
  "extends": ["//"],
  "tasks": {
    "build": {
      // Custom configuration for the build task in this package
    },
    "special-task": {} // New task specific to this package
  }
}
For now, the only valid value for the extends key is ["//"]. // is a special name used to identify the root directory of the monorepo.

Configuration in a package can override any of the configurations for a task. Any keys that are not included are inherited from the extended turbo.json.

Examples
Different frameworks in one Workspace
Let's say your monorepo has multiple Next.js apps, and one SvelteKit app. Both frameworks create their build output with a build script in their respective package.json. You could configure Turborepo to run these tasks with a single turbo.json at the root like this:

./turbo.json

{
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
    }
  }
}
Notice that both .next/** and .svelte-kit/** need to be specified as outputs, even though Next.js apps do not generate a .svelte-kit directory, and vice versa.

With Package Configurations, you can instead add custom configuration in the SvelteKit package in apps/my-svelte-kit-app/turbo.json:

./apps/my-svelte-kit-app/turbo.json

{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": [".svelte-kit/**"]
    }
  }
}
and remove the SvelteKit-specific outputs from the root configuration:

./turbo.json

{
  "tasks": {
    "build": {
-      "outputs": [".next/**", "!.next/cache/**", ".svelte-kit/**"]
+      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
This not only makes each configuration easier to read, it puts the configuration closer to where it is used.

Specialized tasks
In another example, say that the build task in one package dependsOn a compile task. You could universally declare it as dependsOn: ["compile"]. This means that your root turbo.json has to have an empty compile task entry:

./turbo.json

{
  "tasks": {
    "build": {
      "dependsOn": ["compile"]
    },
    "compile": {}
  }
}
With Package Configurations, you can move that compile task into the apps/my-custom-app/turbo.json,

./apps/my-app/turbo.json

{
  "extends": ["//"],
  "tasks": {
    "build": {
      "dependsOn": ["compile"]
    },
    "compile": {}
  }
}
and remove it from the root:

./turbo.json

{
  "tasks": {
+    "build": {}
-    "build": {
-      "dependsOn": ["compile"]
-    },
-    "compile": {}
  }
}
Now, the owners of my-app, can have full ownership over their build task, but continue to inherit any other tasks defined at the root.

Comparison to package-specific tasks
At first glance, Package Configurations may sound a lot like the package#task syntax in the root turbo.json. The features are similar, but have one significant difference: when you declare a package-specific task in the root turbo.json, it completely overwrites the baseline task configuration. With a Package Configuration, the task configuration is merged instead.

Consider the example of the monorepo with multiple Next.js apps and a Sveltekit app again. With a package-specific task, you might configure your root turbo.json like this:

./turbo.json

{
  "tasks": {
    "build": {
      "outputLogs": "hash-only",
      "inputs": ["src/**"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "my-sveltekit-app#build": {
      "outputLogs": "hash-only", // must duplicate this
      "inputs": ["src/**"], // must duplicate this
      "outputs": [".svelte-kit/**"]
    }
  }
}
In this example, my-sveltekit-app#build completely overwrites build for the Sveltekit app, so outputLogs and inputs also need to be duplicated.

With Package Configurations, outputLogs and inputs are inherited, so you don't need to duplicate them. You only need to override outputs in my-sveltekit-app config.

Although there are no plans to remove package-specific task configurations, we expect that Package Configurations can be used for most use cases instead.

Limitations
Although the general idea is the same as the root turbo.json, Package Configurations come with a set of guardrails that can prevent packages from creating potentially confusing situations.

Package Configurations cannot use the workspace#task syntax as task entries
The package is inferred based on the location of the configuration, and it is not possible to change configuration for another package. For example, in a Package Configuration for my-nextjs-app:

./apps/my-nextjs-app/turbo.json

{
  "tasks": {
    "my-nextjs-app#build": {
      // ❌ This is not allowed. Even though it's
      // referencing the correct package, "my-nextjs-app"
      // is inferred, and we don't need to specify it again.
      // This syntax also has different behavior, so we do not want to allow it.
      // (see "Comparison to package-specific tasks" section)
    },
    "my-sveltekit-app#build": {
      // ❌ Changing configuration for the "my-sveltekit-app" package
      // from Package Configuration in "my-nextjs-app" is not allowed.
    },
    "build": {
      // ✅ just use the task name!
    }
  }
}
Note that the build task can still depend on a package-specific task:

./apps/my-nextjs-app/turbo.json

{
  "tasks": {
    "build": {
      "dependsOn": ["some-pkg#compile"] 
    }
  }
}
Package Configurations can only override values in the tasks key
It is not possible to override global configuration like globalEnv or globalDependencies in a Package Configuration. Configuration that would need to be altered in a Package Configuration is not truly global and should be configured differently.

Root turbo.json cannot use the extends key
To avoid creating circular dependencies on packages, the root turbo.json cannot extend from anything. The extends key will be ignored.

Troubleshooting
In large monorepos, it can sometimes be difficult to understand how Turborepo is interpreting your configuration. To help, we've added a resolvedTaskDefinition to the Dry Run output. If you run turbo run build --dry-run, for example, the output will include the combination of all turbo.json configurations that were considered before running the build task.