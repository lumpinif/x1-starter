TypeScript
TypeScript is an excellent tool in monorepos, allowing teams to safely add types to their JavaScript code. While there is some complexity to getting set up, this guide will walk you through the important parts of a TypeScript setup for most use cases.

Sharing TypeScript configuration
Building a TypeScript package
Making type checking faster across your workspace
This guide assumes you are using a recent version of TypeScript and uses some features that are only available in those versions. You may need to adjust the guidance on this page if you are unable to features from those versions.

Sharing tsconfig.json
You want to build consistency into your TypeScript configurations so that your entire repo can use great defaults and your fellow developers can know what to expect when writing code in the Workspace.

TypeScript's tsconfig.json sets the configuration for the TypeScript compiler and features an extends key that you'll use to share configuration across your workspace.

This guide will use create-turbo as an example.

npm
yarn
pnpm
Terminal

npx create-turbo@latest
Use a base tsconfig file
Inside packages/typescript-config, you have a few json files which represent different ways you might want to configure TypeScript in various packages. The base.json file is extended by every other tsconfig.json in the workspace and looks like this:

./packages/typescript-config/base.json

"compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "module": "NodeNext"
}
→ tsconfig options reference
Creating the rest of the package
The other tsconfig files in this package use the extends key to start with the base configuration and customize for specific types of projects, like for Next.js (nextjs.json) and a React library (react-library.json).

Inside package.json, name the package so it can be referenced in the rest of the Workspace:

packages/tsconfig/package.json

{
  "name": "@repo/typescript-config"
}
Building a TypeScript package
Using the configuration package
First, install the @repo/typescript-config package into your package:

npm
yarn
pnpm
./apps/web/package.json

{
  "devDependencies": {
     "@repo/typescript-config": "*",
     "typescript": "latest",
  }
}
Then, extend the tsconfig.json for the package from the @repo/typescript-config package. In this example, the web package is a Next.js application:

./apps/web/tsconfig.json

{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
Creating entrypoints to the package
First, make sure your code gets compiled with tsc so there will be a dist directory. You'll need a build script as well as a dev script:

./packages/ui/package.json

{
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc"
  }
}
Then, set up the entrypoints for your package in package.json so that other packages can use the compiled code:

./packages/ui/package.json

{
  "exports": {
    "./button": {
      "types": "./src/button.ts"
      "default": "./dist/button.js",
    },
    "./input": {
      "types": "./src/input.ts"
      "default": "./dist/input.js",
    }
  }
}
Setting up exports this way has several advantages:

Using the types field allows tsserver to use the code in src as the source of truth for your code's types. Your editor will always be up-to-date with the latest interfaces from your code.
You can quickly add new entrypoints to your package without creating dangerous barrel files.
You'll receive auto-importing suggestions for your imports across package boundaries in your editor. For more information about why you may not want to wildcard the entrypoints, see the limitations section.
If you're publishing the package, you cannot use references to source code in types since only the compiled code will be published to npm. You'll need to generate and reference declaration files and source maps.

Linting your codebase
To use TypeScript as a linter, you can check the types across your workspace fast using Turborepo's caching and parallelization.

First, add a check-types script to any package that you want to check the types for:

./apps/web/package.json

{
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}
Then, create a check-types task in turbo.json. From the Configuring tasks guide, we can make the task run in parallel while respecting source code changes from other packages using a Transit Node:

./turbo.json

{
  "tasks": {
    "topo": {
      "dependsOn": ["^topo"]
    },
    "check-types": {
      "dependsOn": ["topo"]
    }
  }
}
Then, run your task using turbo check-types.

Best practices
Use tsc to compile your packages
For Internal Packages, we recommend that you use tsc to compile your TypeScript libraries whenever possible. While you can use a bundler, it's not necessary and adds extra complexity to your build process. Additionally, bundling a library can mangle the code before it makes it to your applications' bundlers, causing hard to debug issues.

Enable go-to-definition across package boundaries
"Go-to-definition" is an editor feature for quickly navigating to the original declaration or definition of a symbol (like a variable or function) with a click or hotkey. Once TypeScript is configured correctly, you can navigate across Internal Packages with ease.

Just-in-Time Packages
Exports from Just-in-Time Packages will automatically bring you to the original TypeScript source code as long as you aren't using entrypoint wildcards. Go-to-definition will work as expected.

Compiled Packages
Exports from Compiled Packages require the use of declaration and declarationMap configurations for go-to-definition to work. After you've enabled these two configurations for the package, compile the package with tsc, and open the output directory to find declaration files and source maps.

packages
ui
dist
button.js
button.d.ts
button.d.ts.map
With these two files in place, your editor will now navigate to the original source code.

Use Node.js subpath imports instead of TypeScript compiler paths
It's possible to create absolute imports in your packages using the TypeScript compiler's paths option, but these paths can cause failed compilation when using Just-in-Time Packages. As of TypeScript 5.4, you can use Node.js subpath imports instead for a more robust solution.

Just-in-Time Packages
In Just-in-Time packages, imports must target the source code in the package, since build outputs like dist won't be created.

package.json
Source code
./packages/ui/package.json

{
  "imports": {
    "#*": "./src/*"
  }
}
Compiled Packages
In Compiled packages, imports target the built outputs for the package.

package.json
Source code
./packages/ui/package.json

{
  "imports": {
    "#*": "./dist/*"
  }
}
You likely don't need a tsconfig.json file in the root of your project
As mentioned in the Structuring your repository guide, you want to treat each package in your tooling as its own unit. This means each package should have its own tsconfig.json to use instead of referencing a tsconfig.json in the root of your project. Following this practice will make it easier for Turborepo to cache your type checking tasks, simplifying your configuration.

The only case in which you may want to have a tsconfig.json in the Workspace root is to set configuration for TypeScript files that are not in packages. For example, if you have a script written with TypeScript that you need to run from the root, you may need a tsconfig.json for that file.

However, this practice is also discouraged since any changes in the Workspace root will cause all tasks to miss cache. Instead, move those scripts to a different directory in the repository.

You likely don't need TypeScript Project References
We don't recommend using TypeScript Project References as they introduce both another point of configuration as well as another caching layer to your workspace. Both of these can cause problems in your repository with little benefit, so we suggest avoiding them when using Turborepo.

Limitations
Your editor won't use a package's TypeScript version
tsserver is not able to use different TypeScript versions for different packages in your code editor. Instead, it will discover a specific version and use that everywhere.

This can result in differences between the linting errors that show in your editor and when you run tsc scripts to check types. If this is an issue for you, consider keeping the TypeScript dependency on the same version.

Package entrypoint wildcards
We recommend listing the entrypoints to your package explicitly - but, to some, this feels too verbose. Instead, you can use wildcards to capture entrypoints:

./packages/ui/package.json

{
  "exports": {
    "./*": {
      "types": "./src/*.ts",
      "default": "./dist/*.js"
    }
  }
}
While this will work, it comes with the tradeoff of not being able to auto-import across package boundaries due to performance reasons with the TypeScript compiler. This tradeoff may or may not be worth it to you depending on your use case.