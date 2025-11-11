"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBuildFactory = exports.PLUGIN_NAME = void 0;
const tslib_1 = require("tslib");
const blog_plugin_1 = require("./plugins/blog.plugin");
const docs_plugin_1 = require("./plugins/docs.plugin");
const imageGenerator_1 = require("./imageGenerator");
const pages_plugin_1 = require("./plugins/pages.plugin");
const path_1 = tslib_1.__importDefault(require("path"));
const plugins = {
    [docs_plugin_1.DocsPlugin.plugin]: docs_plugin_1.DocsPlugin,
    [blog_plugin_1.BlogPlugin.plugin]: blog_plugin_1.BlogPlugin,
    [pages_plugin_1.PagesPlugin.plugin]: pages_plugin_1.PagesPlugin,
};
exports.PLUGIN_NAME = 'docusaurus-og';
const postBuildFactory = (options, context) => async (props) => {
    const imageGenerator = new imageGenerator_1.ImageGenerator({
        websiteUrl: props.siteConfig.url,
        websiteOutDir: props.outDir,
        dir: options.path,
        pluginDir: path_1.default.join(context.generatedFilesDir, exports.PLUGIN_NAME),
    });
    await imageGenerator.init();
    const pluginNames = Object.keys(options.imageRenderers);
    for (const pluginName of pluginNames) {
        const renderer = options.imageRenderers[pluginName];
        const Plugin = plugins[pluginName];
        const plugin = Plugin && new Plugin(props, options, imageGenerator, renderer);
        plugin && (await plugin.process());
    }
    await imageGenerator.cleanup();
};
exports.postBuildFactory = postBuildFactory;
