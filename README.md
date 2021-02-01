# laravel-mix-valet
Laravel Mix v6 extension that makes HMR work with [Laravel Valet](https://laravel.com/docs/8.x/valet) certificates.

***Note**: This extension assumes you already have your project linked and secured in Valet.*

## Installation

Install the extension:

```sh
npm install laravel-mix-valet --save-dev
```

Next require the extension in your `webpack.mix.js` and call `valet(hostname)`:

```js
const mix = require('laravel-mix');
require('laravel-mix-valet');

mix.js('resources/js/app.js', 'public/js')
    .valet('mysite.test'); // replace with your hostname
```

Alternatively, you can pass a config object instead, which will be merged with the defaults below:

```js
const mix = require('laravel-mix');
require('laravel-mix-valet');

mix.js('resources/js/app.js', 'public/js')
    .valet({
        host: 'mysite.test', // replace with your hostname
        port: 8080,
        ...
    });
```

## Options

| Option                     | Default |
| -------------------------- | ------- |
| **host**                   | null    |
| **port**                   | 8080    |
| **https**                  | true    |
| **removeHotTrailingSlash** | true    |
