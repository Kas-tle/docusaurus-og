"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsPlugin = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const base_plugin_1 = require("./base.plugin");
class DocsPlugin extends base_plugin_1.BasePlugin {
    static plugin = 'docusaurus-plugin-content-docs';
    pluginName = DocsPlugin.plugin;
    pageType = 'docs';
    constructor(context, options, imageGenerator, imageRenderer, writeQueue) {
        super(context, options, imageGenerator, imageRenderer, writeQueue);
    }
    getPagePermalink(page) {
        return page.metadata.permalink;
    }
    getPageHtmlPath(doc) {
        if (!doc.metadata?.permalink) {
            return undefined;
        }
        return path.join(this.stripLangFromPath(this.context.outDir), doc.metadata.permalink, 'index.html');
    }
    loadInstance = async (plugin) => {
        const content = plugin.content;
        const options = plugin.options;
        const loadedVersions = content?.loadedVersions ?? [];
        for (const version of loadedVersions) {
            await this.loadVersion(options, version);
        }
    };
    loadVersion = async (options, version) => {
        const docs = version?.docs ?? [];
        this.pages.push(...docs.map((doc) => ({
            version,
            metadata: doc,
            plugin: options,
        })));
    };
}
exports.DocsPlugin = DocsPlugin;
