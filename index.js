const path = require('path');
const fs = require('fs');
const mix = require('laravel-mix');
const Log = require('laravel-mix/src/Log');

class LaravelMixValet {
    constructor() {
        this.config = {};
    }

    name() {
        return 'valet';
    }

    register(config = {}) {
        const defaults = {
            host: null,
            port: 8080,
            https: true,
            removeHotTrailingSlash: true,
        };

        if (typeof config === 'string') {
            config = { host: config };
        }

        if (!config.host) {
            Log.error(
                'Valet host not configured. Disabling laravel-mix-valet...'
            );
            return;
        }

        let key = this.getCertPath('key', config.host);
        if (!fs.existsSync(key)) {
            Log.message({
                text: `Could not find key at ${key}. Disabling laravel-mix-valet...`,
                type: 'warn',
            });
            return;
        }

        let crt = this.getCertPath('crt', config.host);
        if (!fs.existsSync(crt)) {
            Log.message({
                text: `Could not find certificate at ${crt}. Disabling laravel-mix-valet...`,
                type: 'warn',
            });
            return;
        }

        this.config = { ...defaults, ...config };

        Config.merge({
            hmrOptions: {
                https: this.config.https,
                host: this.config.host,
                port: this.config.port,
            },
        });
    }

    boot() {
        if (!Config.hmr || !this.config.removeHotTrailingSlash) {
            return;
        }

        const hotFile = path.resolve('public', 'hot');

        if (!fs.existsSync(hotFile)) {
            return;
        }

        let url = fs.readFileSync(hotFile, 'utf8');

        fs.writeFileSync(hotFile, url.replace(/\/$/gm, ''));
    }
    webpackConfig(config) {
        if (!Config.hmr) {
            return;
        }

        config.devServer.hot = true;
        config.devServer.firewall = false;

        config.output.publicPath =
            (this.config.https ? 'https' : 'http') +
            `://${this.config.host}:${this.config.port}/`;

        if (this.config.https) {
            config.devServer.https = {
                key: fs.readFileSync(this.getCertPath('key')),
                cert: fs.readFileSync(this.getCertPath('crt')),
            };
        }
    }

    getCertPath(ext, host) {
        if (!['key', 'crt'].includes(ext)) {
            return;
        }

        if (!host) {
            host = this.config.host;
        }

        return path.resolve(
            process.env.HOME,
            `.config/valet/Certificates/${host}.${ext}`
        );
    }
}

mix.extend('valet', new LaravelMixValet());
