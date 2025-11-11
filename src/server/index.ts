import { LoadContext, Props } from '@docusaurus/types'
import { BlogPlugin } from './plugins/blog.plugin'
import { DocsPlugin } from './plugins/docs.plugin'
import { ImageGenerator } from './imageGenerator'
import { PagesPlugin } from './plugins/pages.plugin'
import { PluginOptions } from './types/plugin.types'
import path from 'path';

const plugins = {
    [DocsPlugin.plugin]: DocsPlugin,
    [BlogPlugin.plugin]: BlogPlugin,
    [PagesPlugin.plugin]: PagesPlugin,
}

export const PLUGIN_NAME = 'docusaurus-og'

export const postBuildFactory =
    (options: PluginOptions, context: LoadContext) => async (props: Props) => {
        const imageGenerator = new ImageGenerator({
            websiteUrl: props.siteConfig.url,
            websiteOutDir: props.outDir,
            dir: options.path,
            pluginDir: path.join(context.generatedFilesDir, PLUGIN_NAME),
        })

        await imageGenerator.init()

        const pluginNames = Object.keys(options.imageRenderers)

        for (const pluginName of pluginNames) {
            const renderer = options.imageRenderers[pluginName]
            const Plugin = plugins[pluginName]
            const plugin =
                Plugin && new Plugin(props, options, imageGenerator, renderer!)

            plugin && (await plugin.process())
        }
    }
