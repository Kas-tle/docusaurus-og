import {
    LoadedContent,
    PluginOptions as PagesPluginOptions,
} from '@docusaurus/plugin-content-pages'
import { LoadedPlugin, Props } from '@docusaurus/types'
import { PageData } from '../../index'
import { Document } from '../document'
import { ImageGenerator } from '../imageGenerator'
import { ImageRenderer } from '../types/image.types'
import { PluginOptions } from '../types/plugin.types'
import { BasePlugin } from './base.plugin'
import { WriteQueue } from '../writeQueue'
import logger from '@docusaurus/logger'

type PagesPageItem = Omit<PageData, 'document'>

export class PagesPlugin extends BasePlugin<PagesPageItem> {
    static readonly plugin = 'docusaurus-plugin-content-pages'
    
    protected pluginName = PagesPlugin.plugin
    protected pageType = 'pages'

    constructor(
        context: Props,
        options: PluginOptions,
        imageGenerator: ImageGenerator,
        imageRenderer: ImageRenderer,
        writeQueue: WriteQueue,
    ) {
        super(context, options, imageGenerator, imageRenderer, writeQueue)
    }

    protected getPagePermalink(page: PagesPageItem): string {
        return page.metadata.permalink
    }

    protected getPageHtmlPath(page: PagesPageItem): string | undefined {
        if (!page.metadata?.permalink) {
            return undefined
        }
        return this.getHtmlPathFromPermalink(page.metadata.permalink)
    }

    protected loadInstance = async (plugin: LoadedPlugin) => {
        const content = plugin.content as LoadedContent
        const options = plugin.options as PagesPluginOptions

        if (!Array.isArray(content)) return

        for (const metadata of content) {
            if (!metadata?.permalink) continue

            try {
                const doc = new Document(this.getHtmlPathFromPermalink(metadata.permalink), this.writeQueue)
                await doc.load()

                const title =
                    (doc.loaded && doc.root?.querySelector('title')?.textContent) || ''

                const description =
                    (doc.loaded &&
                        doc.root?.querySelector('meta[name=description]')?.textContent) ||
                    ''

                this.pages.push({
                    metadata: {
                        ...metadata,
                        title,
                        description,
                    },
                    plugin: options,
                })
            } catch (err) {
                logger.warn(`[docusaurus-og] Error loading page: ${metadata.permalink}`)
            }
        }
    }
}