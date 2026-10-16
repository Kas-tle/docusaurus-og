"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesPlugin = void 0;
const tslib_1 = require("tslib");
const document_1 = require("../document");
const base_plugin_1 = require("./base.plugin");
const logger_1 = tslib_1.__importDefault(require("@docusaurus/logger"));
class PagesPlugin extends base_plugin_1.BasePlugin {
    static plugin = 'docusaurus-plugin-content-pages';
    pluginName = PagesPlugin.plugin;
    pageType = 'pages';
    constructor(context, options, imageGenerator, imageRenderer, writeQueue) {
        super(context, options, imageGenerator, imageRenderer, writeQueue);
    }
    getPagePermalink(page) {
        return page.metadata.permalink;
    }
    getPageHtmlPath(page) {
        if (!page.metadata?.permalink) {
            return undefined;
        }
        return this.getHtmlPathFromPermalink(page.metadata.permalink);
    }
    loadInstance = async (plugin) => {
        const content = plugin.content;
        const options = plugin.options;
        if (!Array.isArray(content))
            return;
        for (const metadata of content) {
            if (!metadata?.permalink)
                continue;
            try {
                const doc = new document_1.Document(this.getHtmlPathFromPermalink(metadata.permalink), this.writeQueue);
                await doc.load();
                const title = (doc.loaded && doc.root?.querySelector('title')?.textContent) || '';
                const description = (doc.loaded &&
                    doc.root?.querySelector('meta[name=description]')?.textContent) ||
                    '';
                this.pages.push({
                    metadata: {
                        ...metadata,
                        title,
                        description,
                    },
                    plugin: options,
                });
            }
            catch (err) {
                logger_1.default.warn(`[docusaurus-og] Error loading page: ${metadata.permalink}`);
            }
        }
    };
}
exports.PagesPlugin = PagesPlugin;
