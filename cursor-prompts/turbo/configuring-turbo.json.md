Configuring turbo.json
Configure the behavior of turbo by adding a turbo.json file in your Workspace's root directory.

Changing your root turbo.json file will invalidate the cache for all tasks because it's considered in the global hash. If you'd like the flexibility to change configuration without impacting the global hash, use Package Configurations.

Global options
extends
./apps/web/turbo.json

{
  "extends": ["//"]
}
Extend from the root turbo.json to create specific configuration for a package using Package Configurations.

The only valid value for extends is ["//"] to inherit configuration from the root turbo.json.
If extends is used in the root turbo.json, it will be ignored.
globalDependencies
./turbo.json

{
  "globalDependencies": [".env", "tsconfig.json"]
}
A list of globs that you want to include in all task hashes. If any file matching these globs changes, all tasks will miss cache. Globs are relative to the location of turbo.json.

By default, all files in source control in the Workspace root are included in the global hash.

Globs must be in the repository's source control root. Globs outside of the repository aren't supported.

globalEnv
./turbo.json

{
  "globalEnv": ["GITHUB_TOKEN", "PACKAGE_VERSION", "NODE_ENV"]
}
A list of environment variables that you want to impact the hash of all tasks. Any change to these environment variables will cause all tasks to miss cache.

For more on wildcard and negation syntax, see the env section.

globalPassThroughEnv
./turbo.json

{
  "globalPassThroughEnv": ["AWS_SECRET_KEY", "GITHUB_TOKEN"]
}
A list of environment variables that you want to make available to tasks. Using this key opts all tasks into Strict Environment Variable Mode.

Additionally, Turborepo has a built-in set of global passthrough variables for common cases, like operating system environment variables. This includes variables like HOME, PATH, APPDATA, SHELL, PWD, and more. The full list can be found in the source code.

Passthrough values do not contribute to hashes for caching

If you want changes in these variables to cause cache misses, you will need to include them in env or globalEnv.

ui
Default: "stream"

Select a terminal UI for the repository.

"tui" allows for viewing each log at once and interacting with the task. "stream" outputs logs as they come in and is not interactive.

Terminal

{
  "ui": "tui" | "stream"
}
dangerouslyDisablePackageManagerCheck
Default: false

Turborepo uses your repository's lockfile to determine caching behavior, Package Graphs, and more. Because of this, we use the packageManager field to help you stabilize your Turborepo.

To help with incremental migration or in situations where you can't use the packageManager field, you may use --dangerously-disable-package-manager-check to opt out of this check and assume the risks of unstable lockfiles producing unpredictable behavior. When disabled, Turborepo will attempt a best-effort discovery of the intended package manager meant for the repository.

./turbo.json

{
  "dangerouslyDisablePackageManagerCheck": true
}
You may also opt out of this check via flag or the TURBO_DANGEROUSLY_DISABLE_PACKAGE_MANAGER_CHECK environment variable.

cacheDir
Default: ".turbo/cache"

Specify the filesystem cache directory.

./turbo.json

{
  "cacheDir": ".turbo/cache"
}
daemon
Default: true

Turborepo runs a background process to pre-calculate some expensive operations. This standalone process (daemon) is a performance optimization, and not required for proper functioning of turbo.

./turbo.json
```json
{
  "daemon": true
}
```

```
Good to know:When running in a CI environment the daemon is always disabled regardless of this setting.
envMode
Default: "strict"
```

Turborepo's Environment Modes allow you to control which environment variables are available to a task at runtime:

"strict": Filter environment variables to only those that are specified in the env and globalEnv keys in turbo.json.
"loose": Allow all environment variables for the process to be available.
Read more about Environment Modes.

./turbo.json

{
  "envMode": "strict"
}
Defining tasks
tasks
Each key in the tasks object is the name of a task that can be executed by turbo run. Turborepo will search the packages described in your Workspace's configuration for scripts in package.json with the name of the task.

Using the rest of the configuration described in the task, Turborepo will run the scripts in the described order, caching logs and file outputs in the outputs key when provided.

In the example below, we've defined three tasks under the tasks key: build, test, and dev.

./turbo.json

{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
Task options
Using the options available in the tasks you define in tasks, you can describe how turbo will run your tasks.

dependsOn
A list of tasks that are required to complete before the task begins running.

There are three types of dependsOn relationships: dependency relationships, same-package relationships, and arbitrary task relationships.

Dependency relationships
Prefixing a string in dependsOn with a ^ tells turbo that the task must wait for tasks in the package's dependencies to complete first. For example, in the turbo.json below:

./turbo.json

{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
turbo starts at the "bottom" of the package graph and recursively visits each package until it finds a package with no internal dependencies. It will then run the build task at the end of the dependency chain first, working its way back to the "top" until all build tasks are completed in order.

Same package relationships
Task names without the ^ prefix describe a task that depends on a different task within the same package. For example, in the turbo.json below:

./turbo.json

{
  "tasks": {
    "test": {
      "dependsOn": ["lint", "build"]
    }
  }
}
The test task will only run after the lint and build tasks have completed in the same package.

Arbitrary task relationships
Specify a task dependency between specific package tasks.

./turbo.json

{
  "tasks": {
    "web#lint": {
      "dependsOn": ["utils#build"]
    }
  }
}
In this turbo.json, the web#lint task will wait for the utils#build task to complete.

env
The list of environment variables a task depends on.

./turbo.json

{
  "tasks": {
    "build": {
      "env": ["DATABASE_URL"] // Impacts hash of all build tasks
    },
    "web#build": {
      "env": ["API_SERVICE_KEY"] // Impacts hash of web's build task
    }
  }
}
Good to know:Turborepo automatically includes environment variables prefixed by common frameworks through Framework Inference. For example, if your package is a Next.js project, you do not need to specify any environment variables that start with NEXT_PUBLIC_.
Wildcards
Turborepo supports wildcards for environment variables so you can easily account for all environment variables with a given prefix. For example, the turbo.json below include all environment variables that start with MY_API_ into the hash:

./turbo.json

{
  "tasks": {
    "build": {
      "env": ["MY_API_*"]
    }
  }
}
Negation
A leading ! means that the entire pattern will be negated. For instance, the turbo.json below will ignore the MY_API_URL variable.

./turbo.json

{
  "tasks": {
    "build": {
      "env": ["!MY_API_URL"]
    }
  }
}
Examples
Pattern	Description
"*"	Matches every environment variable.
"!*"	Excludes every environment variable.
"FOO*"	Matches FOO, FOOD, FOO_FIGHTERS, etc.
"FOO\*"	Resolves to "FOO*" and matches FOO, FOOD, and FOO_FIGHTERS.
"FOO\\*"	Matches a single environment variable named FOO*.
"!FOO*"	Excludes all environment variables that start with FOO.
"\!FOO"	Resolves to "!FOO", and excludes a single environment variable named !FOO.
"\\!FOO"	Matches a single environment variable named !FOO.
"FOO!"	Matches a single environment variable named FOO!.
passThroughEnv
An allowlist of environment variables that should be made available to this task's runtime, even when in Strict Environment Mode.

./turbo.json

{
  "tasks": {
    "build": {
      // Values will available within `build` scripts
      "passThroughEnv": ["AWS_SECRET_KEY", "GITHUB_TOKEN"]
    }
  }
}
Values provided in passThroughEnv do not contribute to the cache key for the task. If you'd like changes to these variables to cause cache misses, you will need to include them in env or globalEnv.

outputs
A list of file glob patterns relative to the package's package.json to cache when the task is successfully completed.

./turbo.json

{
  "tasks": {
    "build": {
      // Cache all files emitted to the packages's `dist` directory
      "outputs": ["dist/**"]
    }
  }
}
Omitting this key or passing an empty array tells turbo to cache nothing (except logs, which are always cached when caching is enabled).

cache
Default: true

Defines if task outputs should be cached. Setting cache to false is useful for long-running development tasks and ensuring that a task always runs when it is in the task's execution graph.

./turbo.json

{
  "tasks": {
    "build": {
      "outputs": [".svelte-kit/**", "dist/**"] // File outputs will be cached
    },
    "dev": {
      "cache": false, // No outputs will be cached
      "persistent": true
    }
  }
}
inputs
Default: [], all files in the package that are checked into source control

A list of file glob patterns relative to the package's package.json to consider when determining if a package has changed. turbo.json is always considered an input.

Visit the file glob specification for more information on globbing syntax.

./turbo.json

{
  "tasks": {
    "test": {
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "test/**/*.ts"]
    }
  }
}
Using the inputs key opts you out of turbo's default behavior of considering .gitignore. You must reconstruct the globs from .gitignore as desired or use $TURBO_DEFAULT$ to build off of the default behavior.

$TURBO_DEFAULT$
Because specifying an inputs key immediately opts out of the default behavior, you may use the special string $TURBO_DEFAULT$ within the inputs array to restore turbo's default behavior. This allows you to tweak the default behavior for more granularity.

./turbo.json

{
  "tasks": {
    "check-types": {
      // Consider all default inputs except the package's README
      "inputs": ["$TURBO_DEFAULT$", "!README.md"]
    }
  }
}
outputLogs
Default: full

Set output logging verbosity. Can be overridden by the --output-logs CLI option.

Option	Description
full	Displays all logs
hash-only	Only show the hashes of the tasks
new-only	Only show logs from cache misses
errors-only	Only show logs from task failures
none	Hides all task logs
./turbo.json

{
  "tasks": {
    "build": {
      "outputLogs": "new-only"
    }
  }
}
persistent
Default: false

Label a task as persistent to prevent other tasks from depending on long-running processes. Persistent tasks are made interactive by default.

Because a long-running process won't exit, tasks that would depend on it would never run. Once you've labeled the task as persistent, turbo will throw an error if other tasks depend on it.

This option is most useful for development servers or other "watch" tasks.

./turbo.json

{
  "tasks": {
    "dev": {
      "persistent": true
    }
  }
}
Tasks marked with persistent are also interactive by default.

interactive
Default: false (Defaults to true for tasks marked as persistent)

Label a task as interactive to make it accept inputs from stdin in the terminal UI. Must be used with persistent.

This task is most useful for scripts that can be manipulated while they are running, like Jest or Vitest.

./turbo.json

{
  "tasks": {
    "test:watch": {
      "interactive": true,
      "persistent": true
    }
  }
}
Remote caching
The global remoteCache option has a variety of fields for configuring remote cache usage

./turbo.json

{
  "remoteCache": {}
}
enabled
Default: true

Enables remote caching.

When false, Turborepo will disable all remote cache operations, even if the repo has a valid token. If true, remote caching is enabled, but still requires the user to login and link their repo to a remote cache.

signature
Default: false

Enables signature verification for requests to the remote cache. When true, Turborepo will sign every uploaded artifact using the value of the environment variable TURBO_REMOTE_CACHE_SIGNATURE_KEY. Turborepo will reject any downloaded artifacts that have an invalid signature or are missing a signature.

preflight
Default: false

When enabled, any HTTP request will be preceded by an OPTIONS request to determine if the request is supported by the endpoint.

timeout
Default: 30

Sets a timeout for remote cache operations. Value is given in seconds and only whole values are accepted. If 0 is passed, then there is no timeout for any cache operations.

apiUrl
Default: "https://vercel.com"

Set endpoint for API calls to the remote cache.

loginUrl
Default: "https://vercel.com"

Set endpoint for requesting tokens during turbo login.