const path = require('path');
const fs = require('fs');

let mix = require('laravel-mix');

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
            throw 'Valet host not configured';
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
                key: fs.readFileSync(
                    path.resolve(
                        process.env.HOME,
                        `.config/valet/Certificates/${this.config.host}.key`
                    )
                ),
                cert: fs.readFileSync(
                    path.resolve(
                        process.env.HOME,
                        `.config/valet/Certificates/${this.config.host}.crt`
                    )
                ),
            };
        }
    }
}

mix.extend('valet', new LaravelMixValet());
