# nulink-web

<p align="center">
  <a href="https://www.nulink.org/"><img src="https://github.com/NuLink-network/nulink-resource/blob/94c5538a5fdc25e7d4391f4f2e4af60b3c480fc1/logo/nulink-bg-1.png" width=40%  /></a>
</p>

<p align="center">
  <a href="https://github.com/NuLink-network"><img src="https://img.shields.io/badge/Playground-NuLink_Network-brightgreen?logo=Parity%20Substrate" /></a>
  <a href="http://nulink.org/"><img src="https://img.shields.io/badge/made%20by-NuLink%20Foundation-blue.svg?style=flat-square" /></a>
  <a href="https://github.com/NuLink-network/nulink-web"><img src="https://img.shields.io/badge/project-Nulink_Web-yellow.svg?style=flat-square" /></a>
</p>


The project Nulink-web is a front-end page function that provides an entrance to display all functions of Nulink.


The code lives in the src folder and looks like this
```
src
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # all the global configuration, env variables etc. get exported from here and used in the app
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # re-exporting different libraries preconfigured for the application
|
+-- providers         # all of the application providers
|
+-- routes            # routes configuration
|
+-- stores            # global state stores
|
+-- test              # test utilities and mock server
|
+-- types             # base types used accross the application
|
+-- utils             # shared utility functions
```

A feature could have the following structure:

```
src/features/awesome-feature
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- assets      # assets folder can contain all the static files for a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- hooks       # hooks scoped to a specific feature
|
+-- routes      # route components for a specific feature pages
|
+-- stores      # state stores for a specific feature
|
+-- types       # typescript types for TS specific feature domain
|
+-- utils       # utility functions for a specific feature
|
+-- index.js    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```


A feature folder could also contain other features (if used only within the parent feature) or be kept separated, it's a matter of preference.

Everything from a feature should be exported from the index.js file which behaves as the public API of the feature.

You should import stuff from other features only by using:

import {AwesomeComponent} from "@/features/awesome-feature"

and not

import {AwesomeComponent} from "@/features/awesome-feature/components/AwesomeComponent

This can also be configured in the ESLint configuration to disallow the later import by the following rule:

{ rules: { 'no-restricted-imports': [ 'error', { patterns: ['@/features//'], }, ],

// ...rest of the configuration
}

This was inspired by how NX handles libraries that are isolated but available to be used by the other modules. Think of a feature as a library or a module that is self-contained but can expose different parts to other features via its entry point.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
