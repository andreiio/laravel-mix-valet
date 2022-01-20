# laravel-mix-valet
Laravel Mix v6 extension that makes HMR work with [Laravel Valet](https://laravel.com/docs/8.x/valet) certificates.

***Note**: This extension assumes you already have your project linked and secured in Valet.*

## Installation

Install the extension:

```sh
npm install laravel-mix-valet --save-dev
```

Next require the extension in your `webpack.mix.js` and call `valet()`:

```js
const mix = require('laravel-mix');
require('laravel-mix-valet');

mix.js('resources/js/app.js', 'public/js')
    .valet();
```

Alternatively, you can pass a config object instead, which will be merged with the defaults below:

```js
const mix = require('laravel-mix');
require('laravel-mix-valet');

mix.js('resources/js/app.js', 'public/js')
    .valet({
        host: 'othersite.test',
        port: 12345,
    });
```

## Options

| Option    | Default                 |
| --------- | ----------------------- |
| **host**  | Hostname from `APP_URL` |
| **port**  | 8080                    |
| **https** | true                    |
