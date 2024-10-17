Crafting your repository
Creating an Internal Package
Internal Packages are the building blocks of your workspace, giving you a powerful way to share code and functionality across your repo. Turborepo automatically understands the relationships between Internal Packages using the dependencies in package.json, creating a Package Graph under the hood to optimize your repository's workflows.

Visual representation of a Package Graph in a Turborepo.

Let's create your first Internal Package to share math utilities in your repo using the guidance in the Anatomy of a package section. In the steps below, we assume you've created a new repository using create-turbo or are using a similarly structured repository.

Create an empty directory
You'll need a directory to put the package in. Let's create one at ./packages/math.

package.json
turbo.json
apps
packages
math
ui
eslint-config
typescript-config
Add a package.json
Next, create the package.json for the package. By adding this file, you'll fulfill the two requirements for an Internal Package, making it discoverable to Turborepo and the rest of your Workspace:

npm
yarn
pnpm
./packages/math/package.json

{
  "name": "@repo/math",
  "type": "module",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc"
  },
  "exports": {
    "./add": {
      "types": "./src/add.ts",
      "default": "./dist/add.js"
    },
    "./subtract": {
      "types": "./src/subtract.ts",
      "default": "./dist/subtract.js"
    }
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "latest"
  }
}
Let's break down this package.json piece-by-piece:

scripts: The dev and build script compile the package using the TypeScript compiler. The dev script will watch for changes to source code and automatically recompile the package.
devDependencies: typescript and @repo/typescript-config are devDependencies so you can use those packages in the @repo/math package. In a real-world package, you will likely have more devDependencies and dependencies - but we can keep it simple for now.
exports: Defines multiple entrypoints for the package so it can be used in other packages (import { add } from '@repo/math').
Notably, this package.json declares an Internal Package, @repo/typescript-config, as a dependency. Turborepo will recognize @repo/math as a dependent of @repo/typescript-config for ordering your tasks.

Add a tsconfig.json
Specify the TypeScript configuration for this package by adding a tsconfig.json file to the root of the package. TypeScript has an extends key, allowing you to use a base configuration throughout your repository and overwrite with different options as needed.

./packages/math/tsconfig.json

{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
You've done four important things here:

The @repo/typescript-config/base.json configuration that lives in ./packages/typescript-config has all the configuration you need so you extend from it.
The outDir key in compilerOptions tells TypeScript where to put the compiled output. It matches the directory specified in your exports in package.json.
The rootDir key in compilerOptions ensures that the output in outDir uses the same structure as the src directory.
The include and exclude keys are not inherited from the base configuration, according to the TypeScript specification, so you've included them here.
There's a lot more to learn about TypeScript configuration, but this is a good place to start for now. If you'd like to learn more, visit the official TypeScript documentation or our TypeScript guide.

Add a src directory with source code
You can now write some code for your package. Create two files inside a src directory:

add.ts
subtract.ts
./packages/math/src/add.ts

export const add = (a: number, b: number) => a + b;
These files map to the outputs that will be created by tsc when you run turbo build in a moment.

Add the package to an application
You're ready to use your new package in an application. Let's add it to the web application.

npm
yarn
pnpm
apps/web/package.json

  "dependencies": {
+   "@repo/math": "workspace:*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
You just changed the dependencies in your repo. Make sure to run your package manager's installation command to update your lockfile.

@repo/math is now available in the web application, you can use it in your code:

apps/web/src/app/page.tsx

import { add } from '@repo/math/add';
 
function Page() {
  return <div>{add(1, 2)}</div>;
}
 
export default Page;
Edit turbo.json
Add the artifacts for the new @repo/math library to the outputs for the build task in turbo.json. This ensure that its build outputs will be cached by Turborepo, so they can be restored instantly when you start running builds.

./turbo.json

{
"tasks": {
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "dist/**"]
  }
}
}
Run turbo build
If you've installed turbo globally, run turbo build in your terminal at the root of your Workspace. You can also run the build script from package.json with your package manager, which will use turbo run build.

The @repo/math package built before the web application built so that the runtime code in ./packages/math/dist is available to the web application when it bundles.

You can run turbo build again to see your web application rebuild in milliseconds. We'll discuss this at length in the Caching guide.

Best practices for Internal Packages
One "purpose" per package
When you're creating Internal Packages, it's recommended to create packages that have a single "purpose". This isn't a strict science or rule, but a best practice depending on your repository, your scale, your organization, what your teams need, and more. This strategy has several advantages:

Easier to understand: As a repository scales, developers working in the repository will more easily be able to find the code they need.
Reducing dependencies per package: Using fewer dependencies per package makes it so Turborepo can more effectively prune the dependencies of your package graph.
Some examples include:

@repo/ui: A package containing all of your shared UI components
@repo/tool-specific-config: A package for managing configuration of a specific tool
@repo/graphs: A domain-specific library for creating and manipulating graphical data
Application Packages do not contain shared code
When you're creating Application Packages, it's best to avoid putting shared code in those packages. Instead, you should create a separate package for the shared code and have the application packages depend on that package.

Additionally, Application Packages are not meant to be installed into other packages. Instead, they should be thought of as an entrypoint to your Package Graph.

Good to know:There are rare exceptions to this rule.