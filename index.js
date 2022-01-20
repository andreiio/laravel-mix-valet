const path = require('path');
const fs = require('fs');
const mix = require('laravel-mix');
const merge = require('lodash/merge');

class LaravelMixValet {
    constructor() {
        this.config = {
            host: this.getAppHost(),
            port: 8080,
            https: true,
        };
    }

    name() {
        return 'valet';
    }

    register(config = {}) {
        if (!this.isHot()) {
            return;
        }

        if (typeof config === 'string') {
            config = { host: config };
        }

        merge(this.config, config);

        mix.options({
            hmrOptions: {
                https: this.config.https,
                host: this.config.host,
                port: this.config.port,
            },
        });
    }

    boot() {
        if (!this.isHot()) {
            return;
        }

        this.updateHotFile();
    }

    webpackConfig(config) {
        if (!this.isHot()) {
            return;
        }

        config.devServer.hot = true;

        config.output.publicPath = this.hotUrl();

        if (this.config.https) {
            config.devServer.https = {
                key: this.loadCert('key'),
                cert: this.loadCert('crt'),
            };
        }
    }

    loadCert(ext) {
        const cert = path.resolve(
            process.env.HOME,
            `.config/valet/Certificates/${this.config.host}.${ext}`
        );

        if (!fs.existsSync(cert)) {
            throw new Error(`Could not find ${cert}`);
        }

        return fs.readFileSync(cert);
    }

    updateHotFile() {
        const hotFile = path.resolve('public', 'hot');

        if (!fs.existsSync(hotFile)) {
            return;
        }

        fs.writeFileSync(hotFile, this.hotUrl());
    }

    hotUrl() {
        return (
            (this.config.https ? 'https' : 'http') +
            `://${this.config.host}:${this.config.port}`
        );
    }

    isHot() {
        return process.argv.includes('--hot');
    }

    getAppHost() {
        try {
            return new URL(process.env.APP_URL).hostname;
        } catch (error) {
            return null;
        }
    }
}

mix.extend('valet', new LaravelMixValet());
