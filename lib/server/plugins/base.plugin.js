"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlugin = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const document_1 = require("../document");
const logger_1 = tslib_1.__importDefault(require("@docusaurus/logger"));
const progress = tslib_1.__importStar(require("../progress"));
class BasePlugin {
    context;
    options;
    imageGenerator;
    imageRenderer;
    /**
     * Holds the collected page/doc data for processing.
     */
    pages = [];
    constructor(context, options, imageGenerator, imageRenderer) {
        this.context = context;
        this.options = options;
        this.imageGenerator = imageGenerator;
        this.imageRenderer = imageRenderer;
    }
    /**
     * The main entry point to process this plugin's content.
     */
    process = async () => {
        await this.loadData();
        await this.generate();
    };
    /**
     * Finds all registered Docusaurus plugins matching `this.pluginName`
     * and calls `loadInstance` for each one.
     */
    loadData = async () => {
        const plugins = this.context.plugins.filter((plugin) => plugin.name === this.pluginName);
        for (const plugin of plugins) {
            await this.loadInstance(plugin);
        }
    };
    /**
     * Iterates over all collected pages, loads their HTML,
     * renders the OG image, and injects it into the HTML.
     */
    generate = async () => {
        logger_1.default.info(`Generating og images for ${this.pages.length} ${this.pageType} pages`);
        const bar = progress.defaultBar();
        bar.start(this.pages.length, 0, {
            prefix: 'rendering images',
            suffix: '-',
        });
        for (const page of this.pages) {
            const permalink = this.getPagePermalink(page);
            const htmlPath = this.getPageHtmlPath(page);
            bar.update({ suffix: permalink });
            if (!htmlPath) {
                bar.increment();
                continue;
            }
            const document = new document_1.Document(htmlPath);
            await document.load();
            if (!document.loaded) {
                bar.increment();
                continue;
            }
            const image = await this.imageRenderer({
                ...page,
                document,
                websiteOutDir: this.context.outDir,
            }, this.context);
            if (!image) {
                await document.write();
                bar.increment();
                continue;
            }
            const generated = await this.imageGenerator.generate(...image);
            await document.setImage(generated.url);
            await document.write();
            bar.increment();
        }
        bar.stop();
        logger_1.default.success(`Generated og images for ${this.pageType} pages`);
    };
    /**
     * Removes the i18n locale suffix from a directory path.
     */
    stripLangFromPath = (path) => {
        const lang = this.context.i18n.locales.find((locale) => path.endsWith(`/${locale}`));
        return lang ? path.slice(0, -lang.length - 1) : path;
    };
    /**
     * A common helper to get the HTML file path from a permalink.
     */
    getHtmlPathFromPermalink = (permalink) => {
        return path.join(this.stripLangFromPath(this.context.outDir), permalink, 'index.html');
    };
}
exports.BasePlugin = BasePlugin;
