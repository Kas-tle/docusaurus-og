"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGenerator = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const fsp = tslib_1.__importStar(require("fs/promises"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const path_1 = tslib_1.__importDefault(require("path"));
const resvg_js_1 = require("@resvg/resvg-js");
const _1 = require(".");
class ImageGenerator {
    args;
    satori;
    fileCache = new Set();
    runCache = {};
    outDir = '';
    cacheDir = '';
    constructor(args) {
        this.args = args;
        this.outDir = path_1.default.join(this.args.websiteOutDir, this.args.dir);
        this.cacheDir = path_1.default.join(this.outDir, _1.PLUGIN_NAME, 'cache');
    }
    init = async () => {
        this.satori = await import('satori').then((mod) => mod.default);
        if (!fs.existsSync(this.outDir))
            await fsp.mkdir(this.outDir, { recursive: true });
        if (!fs.existsSync(this.cacheDir)) {
            await fsp.mkdir(this.cacheDir, { recursive: true });
        }
        else {
            const files = await fsp.readdir(this.cacheDir);
            files.forEach((file) => {
                if (file.endsWith('.png')) {
                    const hash = path_1.default.basename(file, '.png');
                    this.fileCache.add(hash);
                }
            });
        }
    };
    generate = async (element, options) => {
        const hash = (0, object_hash_1.default)([element, options]);
        if (this.runCache[hash])
            return this.runCache[hash];
        const imageName = `${hash}.png`;
        const absolutePath = path_1.default.join(this.outDir, imageName);
        const relativePath = path_1.default.join('/', this.args.dir, absolutePath.slice(this.outDir.length));
        const url = new URL(this.args.websiteUrl);
        url.pathname = relativePath;
        const result = {
            relativePath,
            absolutePath,
            url: url.toString(),
        };
        if (this.fileCache.has(hash)) {
            const cachePath = path_1.default.join(this.cacheDir, imageName);
            await fsp.copyFile(cachePath, absolutePath);
            this.runCache[hash] = result;
            return result;
        }
        const svg = await this.satori(element, options);
        const pngBuffer = new resvg_js_1.Resvg(svg).render().asPng();
        await fsp.writeFile(absolutePath, pngBuffer);
        const cachePath = path_1.default.join(this.cacheDir, imageName);
        await fsp.writeFile(cachePath, pngBuffer);
        this.fileCache.add(hash);
        this.runCache[hash] = result;
        return result;
    };
    cleanup = async () => {
        // remove cached files that were not used in this run
        const usedFiles = new Set(Object.values(this.runCache).map((item) => path_1.default.basename(item.absolutePath)));
        const files = await fsp.readdir(this.cacheDir);
        for (const file of files) {
            if (file.endsWith('.png') && !usedFiles.has(file)) {
                await fsp.unlink(path_1.default.join(this.cacheDir, file));
                this.fileCache.delete(path_1.default.basename(file, '.png'));
            }
        }
    };
}
exports.ImageGenerator = ImageGenerator;
