# StarWars5e

The Front-End Web App Project for Star Wars 5e

Live Site: http://sw5e.com

Backend: https://github.com/speedreeder/StarWars5e.Core

## Project Setup

Set the environment variables:

`NODE_ENV` = "development" or "production"

`VUE_APP_sw5eapiurl` = the URL of the API (http://localhost:44341 for local dev)

### Prerequisites
- [Yarn](https://yarnpkg.com/getting-started/install)
  - **NOTE:** If using `corepack enable` to add yarn to your PATH, ensure your terminal is running in administrator mode.

### Install dependencies
```
yarn
```

**NOTE:** If you receive a SecurityError because scripts are disabled on your system, you can run `Set-ExecutionPolicy RemoteSigned` in your terminal to bypass this restriction.

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### For prod debugging:
`document.getElementById('app').__vue__.$store.state`
