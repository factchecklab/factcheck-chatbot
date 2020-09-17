<!--
SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Factcheck Chatbot

The chatbot can be used by the public to search for related fact check reports
and to submit potential misinformation.

This project was bootstrapped with
[Bottender](https://github.com/Yoctol/bottender) init script.

## Configuration

### The `bottender.config.js` File

Bottender configuration file. You can use this file to provide settings for the session store and channels.

### The `.env` File

Bottender utilizes the [dotenv](https://www.npmjs.com/package/dotenv) package to load your environment variables when developing your app.

To make the bot work, you must put required environment variables into your `.env` file.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.<br>
The bot will automatically reload if you make changes to the code.<br>
By default, server runs on [http://localhost:5000](http://localhost:5000) and ngrok runs on [http://localhost:4040](http://localhost:4040).

To run in [Console Mode](https://bottender.js.org/docs/en/the-basics-console-mode), provide the `--console` option:

```sh
npm run dev -- --console
yarn dev --console
```

### `npm start`

Runs the app in production mode.<br>
By default, server runs on [http://localhost:5000](http://localhost:5000).

To run in [Console Mode](https://bottender.js.org/docs/en/the-basics-console-mode), provide the `--console` option:

```sh
npm start -- --console
yarn start --console
```

### `npm run lint`

Runs the linter rules using [Eslint](https://eslint.org/).

### `npm test`

Runs the test cases using [Jest](https://jestjs.io/).


## Contributing

We welcome contributions to our projects! You can ask questions or [file a bug
report](https://gitlab.com/factchecklab/factcheck-chatbot/-/issues/new) by
creating an issue on GitLab. To contribute, fork this repository on
GitLab and create a merge request.

## Getting Help

If you have questions, [file an issue](https://gitlab.com/factchecklab/factcheck-chatbot/-/issues/new)
in our repository on GitLab, you can
also contact us at [tech@factchecklab.org](mailto:tech@factchecklab.org).

## Copyright & License

Copyright (c) 2020 tech@factchecklab.

The source code is licensed under Affero General Public License Version 3.
