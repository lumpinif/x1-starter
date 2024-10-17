Crafting your repository
Managing dependencies
External dependencies come from the npm registry, allowing you to leverage valuable code from the ecosystem to build your applications and libraries faster.
Internal dependencies let you share functionality within your repository, dramatically improving discoverability and usability of shared code. We will discuss how to build an Internal Package in the next guide.
npm
yarn
pnpm
./apps/web/package.json

{
  "dependencies": {
    "next": "latest", // External dependency
    "@repo/ui": "workspace:*" // Internal dependency
  }
}
Best practices for dependency installation
Install dependencies where they're used
When you install a dependency in your repository, you should install it directly in the package that uses it. The package's package.json will have every dependency that the package needs. This is true for both external and internal dependencies.

Good to know:Note that your package manager may choose to use a different node_modules location than the package.
To quickly install dependencies in multiple packages, you can use your package manager:

npm
yarn
pnpm
Terminal

pnpm install jest --save-dev --recursive --filter=web --filter=@repo/ui --filter=@repo/web
→ pnpm documentation
This practice has several benefits:

Improved clarity: It's easier to understand what a package depends on when its dependencies are listed in its package.json. Developers working in the repository can see at a glance what dependencies are used within the package.
Enhanced flexibility: In a monorepo at scale, it can be unrealistic to expect each package to use the same version of an external dependency. When there are many teams working in the same codebase, there will be differing priorities, timelines, and needs due to the realities of operating at scale. By installing dependencies in the package that uses them, you can enable your ui team to bump to the latest version of TypeScript, while your web team can prioritize shipping new features and bumping TypeScript later. Additionally, if you still want to keep dependency versions in sync, you can do that, too.
Better caching ability: If you install too many dependencies in the root of your repository, you'll be changing the workspace root whenever you add, update, or delete a dependency, leading to unnecessary cache misses.
Pruning unused dependencies: For Docker users, Turborepo's pruning feature can remove unused dependencies from Docker images to create lighter images. When dependencies are installed in the packages that they are meant for, Turborepo can read your lockfile and remove dependencies that aren't used in the packages you need.
Few dependencies in the root
Following the first principle above to install dependencies in the package where they're used, you'll find that you naturally end up with few dependencies in the root of your workspace.

The only dependencies that belong in the workspace root are tools for managing the repository whereas dependencies for building applications and libraries are installed in their respective packages. Some examples of dependencies that make sense to install in the root are turbo, husky, or lint-staged.

Managing dependencies
Turborepo does not manage dependencies
Note that Turborepo does not play a role in managing your dependencies, leaving that work up to your package manager of choice.

It's up to the package manager to handle things like downloading the right external dependency version, symlinking, and resolving modules. The recommendations on this page are best practices for managing dependencies in a Workspace, and are not enforced by Turborepo.

node_modules locations
Depending on your choice of package manager, version, settings, and where your dependencies are installed in your Workspace, you may see node_modules and the dependencies inside it in various locations within the Workspace. Dependencies could be found in the root node_modules, in packages' node_modules, or both.

As long as your scripts and tasks are able to find the dependencies they need, your package manager is working correctly.

Referencing `node_modules` in your code

The specific locations for node_modules within the Workspace are not a part of the public API of package managers. This means that referencing node_modules directly (like node ./node_modules/a-package/dist/index.js) can be brittle, since the location of the dependency on disk can change with other dependency changes around the Workspace.

Instead, rely on conventions of the Node.js ecosystem for accessing dependency modules whenever possible.

Keeping dependencies on the same version
Some monorepo maintainers prefer to keep dependencies on the same version across all packages by rule. There are several ways to achieve this:

Using purpose-built tooling
Tools like syncpack, manypkg, and sherif can be used for this specific purpose.

Using your package manager
You can use your package manager to update dependency versions in one command.

npm
yarn
pnpm
Terminal

pnpm up --recursive typescript@latest
→ pnpm documentation
Using an IDE
Your IDE's refactoring tooling can find and replace the version of a dependency across all package.json files in your repository at once. Try using a regex like "next": ".*" on package.json files to find all instances of the next package and replace them with the version you want. When you're done, make sure to run your package manager's install command to update your lockfile.

Next steps
Now that you know how to manage dependencies effectively in a workspace, let's create an Internal Package to be used as a dependency in your monorepo.