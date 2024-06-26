/// <reference types="@docusaurus/plugin-content-docs/src/plugin-content-docs.js" />
import { DocMetadata, LoadedVersion, PluginOptions } from '@docusaurus/plugin-content-docs';
import { Document } from '../document';
export type DocsPageData = {
    plugin: PluginOptions;
    version: LoadedVersion;
    metadata: DocMetadata;
    document: Document;
};
