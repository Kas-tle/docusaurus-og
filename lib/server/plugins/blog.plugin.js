"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPlugin = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const base_plugin_1 = require("./base.plugin");
class BlogPlugin extends base_plugin_1.BasePlugin {
    static plugin = 'docusaurus-plugin-content-blog';
    pluginName = BlogPlugin.plugin;
    pageType = 'blog';
    constructor(context, options, imageGenerator, imageRenderer) {
        super(context, options, imageGenerator, imageRenderer);
    }
    getPagePermalink(page) {
        return page.permalink;
    }
    getPageHtmlPath(page) {
        return this.getHtmlPathFromPermalink(page.permalink);
    }
    loadInstance = async (plugin) => {
        const content = plugin.content;
        const options = plugin.options;
        content.blogListPaginated.forEach((value) => {
            this.pages.push({
                data: value,
                plugin: options,
                pageType: 'list',
                permalink: value.metadata.permalink,
            });
        });
        content.blogPosts.forEach((post) => {
            this.pages.push({
                data: post,
                plugin: options,
                pageType: 'post',
                permalink: post.metadata.permalink,
            });
        });
        if (content.blogTagsListPath) {
            const filePath = this.getHtmlPathFromPermalink(content.blogTagsListPath);
            fs.existsSync(filePath) &&
                this.pages.push({
                    pageType: 'tags',
                    plugin: options,
                    data: {
                        permalink: content.blogTagsListPath,
                    },
                    permalink: content.blogTagsListPath,
                });
        }
        if (options.archiveBasePath) {
            const permalink = path.join('/', options.routeBasePath, options.archiveBasePath);
            fs.existsSync(this.getHtmlPathFromPermalink(permalink)) &&
                this.pages.push({
                    plugin: options,
                    pageType: 'archive',
                    data: { permalink: permalink },
                    permalink,
                });
        }
        {
            Object.entries(content.blogTags).map(([key, value]) => {
                value.pages.forEach((page) => {
                    this.pages.push({
                        pageType: 'tag',
                        plugin: options,
                        data: { ...page.metadata, label: value.label },
                        permalink: page.metadata.permalink,
                    });
                });
            });
        }
    };
}
exports.BlogPlugin = BlogPlugin;
