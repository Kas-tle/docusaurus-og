import { LoadedPlugin, Props } from '@docusaurus/types';
import { ImageGenerator } from '../imageGenerator';
import { ImageRenderer } from '../types/image.types';
import { PluginOptions } from '../types/plugin.types';
import { WriteQueue } from '../writeQueue';
export declare abstract class BasePlugin<T> {
    protected context: Props;
    protected options: PluginOptions;
    protected imageGenerator: ImageGenerator;
    protected imageRenderer: ImageRenderer;
    protected writeQueue: WriteQueue;
    /**
     * Holds the collected page/doc data for processing.
     */
    protected pages: T[];
    /**
     * The unique name of the Docusaurus plugin to filter by.
     * @example 'docusaurus-plugin-content-blog'
     */
    protected abstract pluginName: string;
    /**
     * A human-readable name for the content type, used for logging.
     * @example 'blog', 'docs', 'pages'
     */
    protected abstract pageType: string;
    /**
     * Loads the specific content from a given plugin instance.
     * This is where subclasses will populate `this.pages`.
     */
    protected abstract loadInstance(plugin: LoadedPlugin): Promise<void>;
    /**
     * Returns the permalink for a given page item.
     * Used for progress bar logging.
     */
    protected abstract getPagePermalink(page: T): string;
    /**
     * Returns the final file system path to the 'index.html' for a given page item.
     */
    protected abstract getPageHtmlPath(page: T): string | undefined;
    constructor(context: Props, options: PluginOptions, imageGenerator: ImageGenerator, imageRenderer: ImageRenderer, writeQueue: WriteQueue);
    /**
     * The main entry point to process this plugin's content.
     */
    process: () => Promise<void>;
    /**
     * Finds all registered Docusaurus plugins matching `this.pluginName`
     * and calls `loadInstance` for each one.
     */
    protected loadData: () => Promise<void>;
    /**
     * Iterates over all collected pages, loads their HTML,
     * renders the OG image, and injects it into the HTML.
     */
    protected generate: () => Promise<void>;
    /**
     * Removes the i18n locale suffix from a directory path.
     */
    protected stripLangFromPath: (path: string) => string;
    /**
     * A common helper to get the HTML file path from a permalink.
     */
    protected getHtmlPathFromPermalink: (permalink: string) => string;
}
