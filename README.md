# Project

Implementation of Serres Hackathon 2018 event consept.

## About

Client side implementation of Serres Hackathon 2018 event consept. This application is entirely written on client side. The data is stored on local computer with the help of html5 local storage apis.

## Requirements

nodejs 8+

## Install

```
npm install
npm run build
```

This command will generate a dist folder that you should upload to a web server. This is required to local storage work on the browser.

If you would like to test the application without uploading somewhere else:

```
npm run watch
```

This command will start a web server on port 6002, you can browse [http://localhost:6002/] to test the application.

## Usage

Part A page shows a map of the villages.
Part B page allows you to find the shortest way to collect the dumps. You can also enforce various restrictions here.
Part C page allows you to add/edit villages, locations and the dumps.

## Live demo

Live demo is available at: [https://serres.robinsoft.org/]

## License

[MIT](LICENSE)
