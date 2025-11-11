import * as fs from 'fs'
import * as fsp from 'fs/promises'
import hashObj from 'object-hash'
import path from 'path'
import React from 'react'

import type Satori from 'satori'
import { type SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'


export type ImageGeneratorOptions = SatoriOptions
export type ImageGeneratorResult = {
    url: string
    relativePath: string
    absolutePath: string
}

export class ImageGenerator {
    private satori: typeof Satori
    private fileCache: Set<string> = new Set()
    private runCache: Record<string, ImageGeneratorResult> = {}

    private outDir: string = ''
    private cacheDir: string = ''

    constructor(
        private args: {
            dir: string
            websiteUrl: string
            websiteOutDir: string
            pluginDir: string
        },
    ) {
        this.outDir = path.join(this.args.websiteOutDir, this.args.dir)
        this.cacheDir = path.join(this.args.pluginDir, 'cache')
    }

    public init = async () => {
        this.satori = await import('satori').then((mod) => mod.default)

        if (!fs.existsSync(this.outDir))
            await fsp.mkdir(this.outDir, { recursive: true })

        if (!fs.existsSync(this.cacheDir)) {
            await fsp.mkdir(this.cacheDir, { recursive: true })
        } else {
            const files = await fsp.readdir(this.cacheDir)
            files.forEach((file) => {
                if (file.endsWith('.png')) {
                    const hash = path.basename(file, '.png')
                    this.fileCache.add(hash)
                }
            })
        }
    }

    public generate = async (
        element: React.ReactNode,
        options: ImageGeneratorOptions,
    ): Promise<ImageGeneratorResult> => {
        const hash = hashObj([element, options])
        if (this.runCache[hash]) return this.runCache[hash]!

        const imageName = `${hash}.png`
        const absolutePath = path.join(this.outDir, imageName)
        const relativePath = path.join(
            '/',
            this.args.dir,
            absolutePath.slice(this.outDir.length),
        )
        const url = new URL(this.args.websiteUrl)
        url.pathname = relativePath

        const result = {
            relativePath,
            absolutePath,
            url: url.toString(),
        }

        if (this.fileCache.has(hash)) {
            const cachePath = path.join(this.cacheDir, imageName)
            await fsp.copyFile(cachePath, absolutePath)
            this.runCache[hash] = result
            return result
        }

        const svg = await this.satori(element, options)

        const pngBuffer = new Resvg(svg).render().asPng()
        await fsp.writeFile(absolutePath, pngBuffer as Uint8Array)
        const cachePath = path.join(this.cacheDir, imageName)
        await fsp.writeFile(cachePath, pngBuffer as Uint8Array)
        this.fileCache.add(hash)

        this.runCache[hash] = result

        return result
    }

    public cleanup = async () => {
        // remove cached files that were not used in this run
        const usedFiles = new Set(
            Object.values(this.runCache).map((item) =>
                path.basename(item.absolutePath),
            ),
        )

        const files = await fsp.readdir(this.cacheDir)
        for (const file of files) {
            if (file.endsWith('.png') && !usedFiles.has(file)) {
                await fsp.unlink(path.join(this.cacheDir, file))
                this.fileCache.delete(path.basename(file, '.png'))
            }
        }
    }
}
