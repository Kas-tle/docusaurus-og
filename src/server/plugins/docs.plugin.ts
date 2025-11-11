import {
    PluginOptions as DocsPluginOptions,
    LoadedContent,
    LoadedVersion,
} from '@docusaurus/plugin-content-docs'
import { LoadedPlugin, Props } from '@docusaurus/types'
import * as path from 'path'
import { ImageGenerator } from '../imageGenerator'
import { DocsPageData } from '../types/docs.types'
import { ImageRenderer } from '../types/image.types'
import { PluginOptions } from '../types/plugin.types'
import { BasePlugin } from './base.plugin'

type DocsPageItem = Omit<DocsPageData, 'document'>

export class DocsPlugin extends BasePlugin<DocsPageItem> {
    static readonly plugin = 'docusaurus-plugin-content-docs'
    
    protected pluginName = DocsPlugin.plugin
    protected pageType = 'docs'

    constructor(
        context: Props,
        options: PluginOptions,
        imageGenerator: ImageGenerator,
        imageRenderer: ImageRenderer,
    ) {
        super(context, options, imageGenerator, imageRenderer)
    }

    protected getPagePermalink(page: DocsPageItem): string {
        return page.metadata.permalink
    }

    protected getPageHtmlPath(doc: DocsPageItem): string | undefined {
        // Custom path logic for docs, as it was in the original
        if (!doc.metadata?.permalink) {
            return undefined
        }
        return path.join(
            this.stripLangFromPath(this.context.outDir),
            doc.metadata.permalink,
            'index.html',
        )
    }

    protected loadInstance = async (plugin: LoadedPlugin) => {
        const content = plugin.content as LoadedContent
        const options = plugin.options as DocsPluginOptions

        const { loadedVersions } = content

        for (const version of loadedVersions) {
            await this.loadVersion(options, version)
        }
    }

    private loadVersion = async (
        options: DocsPluginOptions,
        version: LoadedVersion,
    ) => {
        this.pages.push(
            ...version.docs.map((doc) => ({
                version,
                metadata: doc,
                plugin: options,
            })),
        )
    }
}