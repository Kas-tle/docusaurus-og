"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteQueue = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const fs_1 = tslib_1.__importDefault(require("fs"));
const logger_1 = tslib_1.__importDefault(require("@docusaurus/logger"));
class WriteQueue extends events_1.EventEmitter {
    q;
    paused;
    inFlightCntr;
    maxConcurrent;
    constructor(concurrent = 10) {
        super();
        this.q = [];
        this.paused = false;
        this.inFlightCntr = 0;
        this.maxConcurrent = concurrent;
    }
    addWrite(filePath, data) {
        this.q.push({ operation: 'write', filePath, data });
        this.write();
    }
    addCopy(srcPath, destPath) {
        this.q.push({ operation: 'copy', srcPath, destPath });
        this.write();
    }
    write() {
        while (!this.paused && this.q.length && this.inFlightCntr < this.maxConcurrent) {
            this.inFlightCntr++;
            let item = this.q.shift();
            if (!item) {
                this.inFlightCntr--;
                return;
            }
            ;
            try {
                switch (item.operation) {
                    case 'copy':
                        fs_1.default.copyFile(item.srcPath, item.destPath, _err => {
                            this.inFlightCntr--;
                            this.write();
                        });
                        break;
                    case 'write':
                        fs_1.default.writeFile(item.filePath, item.data, _err => {
                            this.inFlightCntr--;
                            this.write();
                        });
                        break;
                    default:
                        throw new Error(`Unknown operation: ${item.operation}`);
                }
            }
            catch (e) {
                this.err(e);
            }
        }
    }
    err(e) {
        logger_1.default.error(e);
    }
    waitForIdle() {
        return new Promise((resolve) => {
            const checkIdle = () => {
                if (this.q.length === 0 && this.inFlightCntr === 0) {
                    resolve();
                }
                else {
                    setTimeout(checkIdle, 50);
                }
            };
            checkIdle();
        });
    }
}
exports.WriteQueue = WriteQueue;
