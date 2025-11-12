"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGenerator = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const fsp = tslib_1.__importStar(require("fs/promises"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const path_1 = tslib_1.__importDefault(require("path"));
const resvg_js_1 = require("@resvg/resvg-js");
const writeQueue_1 = require("./writeQueue");
class ImageGenerator {
    args;
    satori;
    siteCache = new Set();
    runCache = new Set();
    writeQueue = new writeQueue_1.WriteQueue();
    outDir = '';
    cacheDir = '';
    constructor(args) {
        this.args = args;
        this.outDir = path_1.default.join(this.args.websiteOutDir, this.args.dir);
        this.cacheDir = path_1.default.join(this.args.pluginDir, this.args.currentLocale, 'cache');
    }
    init = async () => {
        this.satori = await import('satori').then((mod) => mod.default);
        if (!fs.existsSync(this.outDir))
            await fsp.mkdir(this.outDir, { recursive: true });
        if (!fs.existsSync(this.cacheDir)) {
            await fsp.mkdir(this.cacheDir, { recursive: true });
        }
        else {
            const siteCacheFiles = await fsp.readdir(this.cacheDir);
            siteCacheFiles.forEach((file) => {
                if (file.endsWith('.png')) {
                    const hash = path_1.default.basename(file, '.png');
                    this.siteCache.add(hash);
                }
            });
        }
        const runCacheFiles = await fsp.readdir(this.outDir);
        runCacheFiles.forEach((file) => {
            if (file.endsWith('.png')) {
                const hash = path_1.default.basename(file, '.png');
                this.runCache.add(hash);
            }
        });
    };
    generate = async (element, options) => {
        const hash = (0, object_hash_1.default)([element, options]);
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
        if (this.runCache.has(hash)) {
            return result;
        }
        const cachePath = path_1.default.join(this.cacheDir, imageName);
        if (this.siteCache.has(hash)) {
            this.writeQueue.addCopy(cachePath, absolutePath);
            this.runCache.add(hash);
            return result;
        }
        const svg = await this.satori(element, options);
        const pngBuffer = new resvg_js_1.Resvg(svg).render().asPng();
        this.writeQueue.addWrite(absolutePath, pngBuffer);
        this.writeQueue.addWrite(cachePath, pngBuffer);
        this.runCache.add(hash);
        return result;
    };
    cleanup = async () => {
        await this.writeQueue.waitForIdle();
        const files = await fsp.readdir(this.cacheDir);
        for (const file of files) {
            if (file.endsWith('.png') && !this.runCache.has(path_1.default.basename(file, '.png'))) {
                await fsp.unlink(path_1.default.join(this.cacheDir, file));
                this.siteCache.delete(path_1.default.basename(file, '.png'));
            }
        }
    };
}
exports.ImageGenerator = ImageGenerator;
