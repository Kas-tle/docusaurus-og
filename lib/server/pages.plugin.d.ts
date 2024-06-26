import { LoadedPlugin, Props } from '@docusaurus/types';
import { PageData } from '../index';
import { ImageGenerator } from './imageGenerator';
import { ImageRenderer } from './types/image.types';
import { PluginOptions } from './types/plugin.types';
export declare class PagesPlugin {
    private context;
    private options;
    private imageGenerator;
    private imageRenderer;
    static plugin: string;
    pages: Omit<PageData, 'document'>[];
    constructor(context: Props, options: PluginOptions, imageGenerator: ImageGenerator, imageRenderer: ImageRenderer);
    process: () => Promise<void>;
    loadData: () => Promise<void>;
    loadInstance: (plugin: LoadedPlugin) => Promise<void>;
    generate: () => Promise<void>;
    getHtmlPath: (permalink: string) => string;
    stripLangFromPath: (path: string) => string;
}
