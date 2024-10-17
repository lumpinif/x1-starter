Using Monorepos
Monorepos allow you to manage and organize multiple projects in a single directory so they are easier to work with. Learn how to deploy a monorepo here.
Monorepos allow you to manage multiple projects in a single directory. They are a great way to organize your projects and make them easier to work with.

Quickstart
Get started with monorepos on Vercel in a few minutes by using one of our monorepo quickstart templates.



Turborepo
Read the Turborepo docs, or start from an example.

Nx
Read the Nx docs, or start from an example.
Using monorepos with Vercel dashboard
Use the New Project button to import your monorepo Project from within your Personal or Team Account.

If you'd like to deploy multiple different directories within the same Git repository, you can do so by creating a separate Project for each directory and configuring the Root Directory setting for it.

To achieve this, import your Git repository multiple times, edit the Root Directory in the Project Configuration for each import, and choose the corresponding Project. This will configure the Root Directory of each Project to its relevant directory in the repository.


Selecting a Root Directory for one of your new Projects.
Once you've created a separate Project for each of the directories within your Git repository, every commit will issue a Deployment for all connected Projects and display the resulting URLs on your pull requests and commits:


An example of Deployment URLs provided for a Deployment through Git.

The number of Vercel Projects connected with the same Git repository is limited depending on your plan.

Using monorepos with Vercel CLI
Vercel CLI should always be invoked from the monorepo root, not the subdirectory. You should use Vercel CLI 20.1.0 or newer.

First, run vercel link to select the Vercel Project. You'll need to select one at a time.

If you're working in a monorepo using the Git Integration, you can link multiple projects at once using vc link --repo. Visit CLI docs to learn more.

Once linked, subsequent commands such as vercel dev will use the selected Vercel Project. To switch to a different Project in the same monorepo, run vercel link again and select the new Project.

Alternatively, you can use git clone to create multiple copies of your monorepo in different directories and link each one to a different Vercel Project.

See this example of a monorepo with Yarn Workspaces.

When does a monorepo build occur?
By default, pushing a commit to your monorepo will create a Deployment for each of the connected Vercel projects.

Ignoring the build step
If you want to cancel the Build Step for certain projects if their files didn't change, you can do so with the Ignored Build Step project setting.

If you have created a script to ignore the build step, you can skip the the script when redeploying or promoting your app to production. This can be done through the dashboard when you click on the Redeploy button, and unchecking the Use project's Ignore Build Step checkbox.

When you use Turborepo, you can intelligently cancel builds using turbo-ignore.

Skipping unaffected projects
Vercel can detect which projects are affected by a commit and only build those projects. This option can be configured in the Root Directory settings.

This is a powerful setting for monorepos with many projects since it does not occupy any concurrent build slots, unlike the Ignored Build Step feature. This means reducing the number of queued builds by automatically skipping projects that don't need to build.

Requirements
The monorepo must be using npm, yarn, or pnpm workspaces.
We detect your package manager first by the lockfile present at the repository root. You can also specify the package manager with the packageManager field in root package.json file.
All packages within the workspace must have a unique name field in their package.json file.
Dependencies between packages in the monorepo must be explicitly stated in each package's package.json file. This is necessary to determine the dependency graph between packages.
For example, an end-to-end tests package (package-e2e) tests must depend on the package it tests (package-core) in the package.json of package-e2e.
This feature is only available for projects connected to GitHub repositories.
Monorepo FAQ
How can I speed up builds?
Whether or not your deployments are queued depends on the amount of Concurrent Builds you have available. Hobby plans are limited to 1 Concurrent Build, while Pro or Enterprise plans can customize the amount on the "Billing" page in the team settings.

Learn more about Concurrent Builds.

How can I make my projects available on different paths under the same domain?"
After having set up your monorepo as described above, each of the directories will be a separate Vercel project, and therefore be available on a separate domain.

If you'd like to host multiple projects under a single domain, you can create a new project, assign the domain in the project settings, and proxy requests to the other upstream projects. The proxy can be implemented using a vercel.json file with the rewrites property, where each source is the path under the main domain and each destination is the upstream project domain.

How are projects built after I push?
Pushing a commit to a Git repository that is connected with multiple Vercel projects will result in multiple deployments being created and built in parallel for each.

Can I share source files between projects? Are shared packages supported?
To access source files outside the Root Directory, enable the Include source files outside of the Root Directory in the Build Step option in the Root Directory section within the project settings.

For information on using Yarn workspaces, see Deploying a Monorepo Using Yarn Workspaces to Vercel.

Vercel projects created after August 27th 2020 23:50 UTC have this option enabled by default. If you're using Vercel CLI, at least version 20.1.0 is required.

How can I use Vercel CLI without Project Linking?
Vercel CLI will accept Environment Variables instead of Project Linking, which can be useful for deployments from CI providers. For example:

terminal

VERCEL_ORG_ID=team_123 VERCEL_PROJECT_ID=prj_456 vercel
Learn more about Vercel CLI for custom workflows.

Can I use Turborepo on the Hobby plan?
Yes. Turborepo is available on all plans.

Can I use Nx with environment variables on Vercel?
When using Nx on Vercel with environment variables, you may encounter an issue where some of your environment variables are not being assigned the correct value in a specific deployment.

This can happen if the environment variable is not initialized or defined in that deployment. If that's the case, the system will look for a value in an existing cache which may or may not be the value you would like to use. It is a recommended practice to define all environment variables in each deployment for all monorepos.

With Nx, you also have the ability to prevent the environment variable from using a cached value. You can do that by using Runtime Hash Inputs . For example, if you have an environment variable MY_VERCEL_ENV in your project, you will add the following line to your nx.json configuration file:

nx.json

"runtimeCacheInputs": ["echo $MY_VERCEL_ENV"]
Last updated on July 24, 2024