import { LoadContext, Props } from '@docusaurus/types';
import { PluginOptions } from './types/plugin.types';
export declare const PLUGIN_NAME = "docusaurus-og";
export declare const postBuildFactory: (options: PluginOptions, context: LoadContext) => (props: Props) => Promise<void>;
