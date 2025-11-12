import { LoadedPlugin, Props } from '@docusaurus/types';
import { ImageGenerator } from '../imageGenerator';
import { DocsPageData } from '../types/docs.types';
import { ImageRenderer } from '../types/image.types';
import { PluginOptions } from '../types/plugin.types';
import { BasePlugin } from './base.plugin';
import { WriteQueue } from '../writeQueue';
type DocsPageItem = Omit<DocsPageData, 'document'>;
export declare class DocsPlugin extends BasePlugin<DocsPageItem> {
    static readonly plugin = "docusaurus-plugin-content-docs";
    protected pluginName: string;
    protected pageType: string;
    constructor(context: Props, options: PluginOptions, imageGenerator: ImageGenerator, imageRenderer: ImageRenderer, writeQueue: WriteQueue);
    protected getPagePermalink(page: DocsPageItem): string;
    protected getPageHtmlPath(doc: DocsPageItem): string | undefined;
    protected loadInstance: (plugin: LoadedPlugin) => Promise<void>;
    private loadVersion;
}
export {};
