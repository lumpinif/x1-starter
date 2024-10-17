Developing applications
Developing applications in a monorepo unlocks powerful workflows, enabling you to make atomic commits to source control with easy access to code.

Most development tasks are long-running tasks that watch for changes to your code. Turborepo enhances this experience with a powerful terminal UI and other capabilities like:

Configuration for dev tasks
Interacting with tasks
Watch Mode
Running setup scripts
Filtering tasks to run a subset of your packages
Configuring development tasks
Defining a development task in turbo.json tells Turborepo that you'll be running a long-lived task. This is useful for things like running a development server, running tests, or building your application.

To register a dev task, add it to your turbo.json with two properties:

./turbo.json

{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
"cache": false: Tells Turborepo to not attempt to cache the results of the task. Since this is a development task, you're likely to be making frequent changes to your code, so caching the results is not useful.
"persistent": true: Tells Turborepo to keep the task running until you stop it. This key serves as a signal for your terminal UI to treat the task as long-running and interactive. Additionally, it prevents you from accidentally depending on a task that will not exit.
You can now run your dev task to start your development scripts in parallel:

Terminal

turbo dev
Interacting with tasks
Some scripts allow you to type into them using stdin for interactive inputs. Using the terminal ui, you can select a task, enter it, and use stdin as you typically would.

A task must be interactive to enable this functionality.

Running setup tasks before dev
You may also want to run scripts that set up your development environment or pre-build packages. You can make sure those tasks run before the dev task with dependsOn:

./turbo.json

{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["//#dev:setup"]
    },
    "//#dev:setup": {
      "outputs": [".codegen/**"]
    }
  }
}
In this example, we're using a Root Task but you can use the same idea for arbitrary tasks in packages.

Running a specific application
The --filter flag allows you to pick a subset of your Package Graph so you can run your dev task for a specific application and its dependencies:

Terminal

turbo dev --filter=web
Watch Mode
Many tools have a built-in watcher, like tsc --watch, that will respond to changes in your source code. However, some don't.

turbo watch adds a dependency-aware watcher to any tool. Changes to source code will follow the Task Graph that you've described in turbo.json, just like all your other tasks.

For example, using a package structure like create-turbo with the following tasks and scripts:

turbo.json
packages/ui
apps/web
turbo.json
```json
{
  "tasks": {
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

```json
{
  "name": "@repo/ui"
  "scripts": {
    "dev": "tsc --watch",
    "lint": "eslint ."
  }
}
```

```json
{
  "name": "web"
  "scripts": {
    "dev": "next dev",
    "lint": "eslint ."
  },
  "dependencies": {
      "@repo/ui": "workspace:*"
    }
}
```
When you run turbo watch dev lint, you'll see the lint scripts are re-run whenever you make source code changes, despite ESLint not having a built-in watcher. turbo watch is also aware of internal dependencies, so a code change in @repo/ui will re-run the task in both @repo/ui and web.

The Next.js development server in web and the TypeScript Compiler's built-in watcher in @repo/ui will continue to work as usual, since they are marked with persistent.

For more information, visit the turbo watch reference.

Limitations
Teardown tasks
In some cases, you may want to run a script when the dev task is stopped. Turborepo is unable to run those teardown scripts when exiting because turbo exits when your dev tasks exit.

Instead, create a turbo dev:teardown script that you run separately after you've exited your primary turbo dev task.