import { LoadedPlugin, Props } from '@docusaurus/types';
import { PageData } from '../../index';
import { ImageGenerator } from '../imageGenerator';
import { ImageRenderer } from '../types/image.types';
import { PluginOptions } from '../types/plugin.types';
import { BasePlugin } from './base.plugin';
import { WriteQueue } from '../writeQueue';
type PagesPageItem = Omit<PageData, 'document'>;
export declare class PagesPlugin extends BasePlugin<PagesPageItem> {
    static readonly plugin = "docusaurus-plugin-content-pages";
    protected pluginName: string;
    protected pageType: string;
    constructor(context: Props, options: PluginOptions, imageGenerator: ImageGenerator, imageRenderer: ImageRenderer, writeQueue: WriteQueue);
    protected getPagePermalink(page: PagesPageItem): string;
    protected getPageHtmlPath(page: PagesPageItem): string | undefined;
    protected loadInstance: (plugin: LoadedPlugin) => Promise<void>;
}
export {};
