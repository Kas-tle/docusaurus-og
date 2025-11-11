import { LoadedPlugin, Props } from '@docusaurus/types'
import * as path from 'path'
import { Document } from '../document'
import { ImageGenerator } from '../imageGenerator'
import { ImageRenderer } from '../types/image.types'
import { PluginOptions } from '../types/plugin.types'
import logger from '@docusaurus/logger'
import * as progress from '../progress'

export abstract class BasePlugin<T> {
    /**
     * Holds the collected page/doc data for processing.
     */
    protected pages: T[] = []

    /**
     * The unique name of the Docusaurus plugin to filter by.
     * @example 'docusaurus-plugin-content-blog'
     */
    protected abstract pluginName: string

    /**
     * A human-readable name for the content type, used for logging.
     * @example 'blog', 'docs', 'pages'
     */
    protected abstract pageType: string

    /**
     * Loads the specific content from a given plugin instance.
     * This is where subclasses will populate `this.pages`.
     */
    protected abstract loadInstance(plugin: LoadedPlugin): Promise<void>

    /**
     * Returns the permalink for a given page item.
     * Used for progress bar logging.
     */
    protected abstract getPagePermalink(page: T): string

    /**
     * Returns the final file system path to the 'index.html' for a given page item.
     */
    protected abstract getPageHtmlPath(page: T): string | undefined

    constructor(
        protected context: Props,
        protected options: PluginOptions,
        protected imageGenerator: ImageGenerator,
        protected imageRenderer: ImageRenderer,
    ) { }

    /**
     * The main entry point to process this plugin's content.
     */
    public process = async () => {
        await this.loadData()
        await this.generate()
    }

    /**
     * Finds all registered Docusaurus plugins matching `this.pluginName`
     * and calls `loadInstance` for each one.
     */
    protected loadData = async () => {
        const plugins = this.context.plugins.filter(
            (plugin) => plugin.name === this.pluginName,
        )

        for (const plugin of plugins) {
            await this.loadInstance(plugin)
        }
    }

    /**
     * Iterates over all collected pages, loads their HTML,
     * renders the OG image, and injects it into the HTML.
     */
    protected generate = async () => {
        logger.info(
            `Generating og images for ${this.pages.length} ${this.pageType} pages`,
        )
        const bar = progress.defaultBar()
        bar.start(this.pages.length, 0, {
            prefix: 'rendering images',
            suffix: '-',
        })

        for (const page of this.pages) {
            const permalink = this.getPagePermalink(page)
            const htmlPath = this.getPageHtmlPath(page)

            bar.update({ suffix: permalink })

            if (!htmlPath) {
                bar.increment()
                continue
            }

            const document = new Document(htmlPath)
            await document.load()

            if (!document.loaded) {
                bar.increment()
                continue
            }

            const image = await this.imageRenderer(
                {
                    ...page,
                    document,
                    websiteOutDir: this.context.outDir,
                },
                this.context,
            )

            if (!image) {
                await document.write()
                bar.increment()
                continue
            }

            const generated = await this.imageGenerator.generate(...image)
            await document.setImage(generated.url)
            await document.write()
            bar.increment()
        }
        bar.stop()
        logger.success(`Generated og images for ${this.pageType} pages`)
    }

    /**
     * Removes the i18n locale suffix from a directory path.
     */
    protected stripLangFromPath = (path: string): string => {
        const lang = this.context.i18n.locales.find((locale) =>
            path.endsWith(`/${locale}`),
        )
        return lang ? path.slice(0, -lang.length - 1) : path
    }

    /**
     * A common helper to get the HTML file path from a permalink.
     */
    protected getHtmlPathFromPermalink = (permalink: string): string => {
        return path.join(
            this.stripLangFromPath(this.context.outDir),
            permalink,
            'index.html',
        )
    }
}