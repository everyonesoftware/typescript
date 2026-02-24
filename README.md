# Everything

## Concept

The **everything** folder contains all of my TypeScript source code. The intention is that all source code for a specific language could be in the same folder and that different applications would just pull in the source files that they need. This would eliminate the need for libraries, which should make bundling easier and more efficient. It should also improve build and test times since making changes (changing source code, building, and then testing) would immediately appear in other projects.

## Challenges

The biggest challenge I can think of is that the current TypeScript tooling doesn't support this approach. All of the existing tooling (such as npm, yarn, pnpm) only support single-folder packages. Some support mono-repo packages, but what I'm describing isn't a mono-repo. Technically, yes, my idea is that multiple projects would exist in the same folder, but mono-repos have a root directory where common configuration goes and then sub-folders for each different project. My approach is different from this in that I want a single source code folder. Project configuration files would go into the root of the repository. Source code files would be compiled and tested whenever they're changed. Finally project outputs (such as executable files or bundled websites) could either automatically be packaged or they could be packaged on demand later.