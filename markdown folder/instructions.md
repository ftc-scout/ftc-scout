# Running and Installing FtcScout

These instructions explain how to install and locally run the FtcScout website.

## When Cloning for the First Time

-   Install redis and postgres.
-   Create a postgres database with the name `ftc-scout`.
-   Start the redis server.

```
ftc-scout> npm i
ftc-scout> npm run prepare # This installs the git hooks the make sure your code is formatted before each commit.
```

-   Then move on to the When Pulling section (skip the git pull).
-   Copy the `env.example` in the server directory and rename it to `.env`. Add the required data.
-   Stop the server and run `ftc-scout/server> npm run start --load-teams`. This will fetch the required data from the FIRST api.
-   Stop this server and run it again as `ftc-scout/server> npm run dev`.

## When Pulling

```
ftc-scout> git pull
ftc-scout> cd server
ftc-scout/server> npm i

# At this point open two new terminals for these next two commands
ftc-scout/server> npm run watch
ftc-scout/server> npm run dev # this is neccesary so that the graphql schema is available for gen in web.

ftc-scout/server> cd ../web
ftc-scout/web> npm i
ftc-scout/web> npm run gen
```

## When developing

It is recommended to have four terminals open for development

1. `ftc-scout/server> npm run watch # recompiles your typescript`
2. `ftc-scout/server> npm run dev # reruns the server whenever you make code changes`
3. `ftc-scout/web> npm run dev # watches for changes and reruns the website`
4. `ftc-scout> # for general use such as git`

## VsCode

Use the provided `ftc-scout.code-workspace` in the root directory.

### Plugins

The following plugins are also recommended:

1. Svelte for VS Code
2. Prettier - Code formatter
