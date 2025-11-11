import { LoadedPlugin, Props } from '@docusaurus/types';
import { ImageGenerator } from '../imageGenerator';
import { BlogPageData } from '../types/blog.types';
import { ImageRenderer } from '../types/image.types';
import { PluginOptions } from '../types/plugin.types';
import { BasePlugin } from './base.plugin';
type BlogPageItem = Omit<BlogPageData, 'document'>;
export declare class BlogPlugin extends BasePlugin<BlogPageItem> {
    static readonly plugin = "docusaurus-plugin-content-blog";
    protected pluginName: string;
    protected pageType: string;
    constructor(context: Props, options: PluginOptions, imageGenerator: ImageGenerator, imageRenderer: ImageRenderer);
    protected getPagePermalink(page: BlogPageItem): string;
    protected getPageHtmlPath(page: BlogPageItem): string | undefined;
    protected loadInstance: (plugin: LoadedPlugin) => Promise<void>;
}
export {};
