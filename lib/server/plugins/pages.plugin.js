"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesPlugin = void 0;
const document_1 = require("../document"); // Still needed here for loadInstance
const base_plugin_1 = require("./base.plugin");
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
        return this.getHtmlPathFromPermalink(page.metadata.permalink);
    }
    loadInstance = async (plugin) => {
        const content = plugin.content;
        const options = plugin.options;
        if (!Array.isArray(content))
            return;
        for (const metadata of content) {
            const doc = new document_1.Document(this.getHtmlPathFromPermalink(metadata.permalink), this.writeQueue);
            await doc.load();
            const title = (doc.loaded && doc.root.querySelector('title')?.textContent) || '';
            const description = (doc.loaded &&
                doc.root.querySelector('meta[name=description]')?.textContent) ||
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
    };
}
exports.PagesPlugin = PagesPlugin;
