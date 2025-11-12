"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const fs_1 = tslib_1.__importDefault(require("fs"));
class Queue extends events_1.EventEmitter {
    q;
    paused;
    inFlightCntr;
    fileCntr;
    maxConcurrent;
    basePath;
    constructor(basePath, baseIndex, concurrent = 5) {
        super();
        this.q = [];
        this.paused = false;
        this.inFlightCntr = 0;
        this.fileCntr = baseIndex;
        this.maxConcurrent = concurrent;
        this.basePath = basePath;
    }
    add(data) {
        this.q.push(data);
        this.write();
    }
    write() {
        while (!this.paused && this.q.length && this.inFlightCntr < this.maxConcurrent) {
            this.inFlightCntr++;
            let buf = this.q.shift();
            try {
                fs_1.default.writeFile(this.basePath + this.fileCntr++, buf, err => {
                    this.inFlightCntr--;
                    if (err) {
                        this.err(err);
                    }
                    else {
                        this.write();
                    }
                });
            }
            catch (e) {
                this.err(e);
            }
        }
    }
    err(e) {
        this.pause();
        this.emit('error', e);
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
        this.write();
    }
}
exports.Queue = Queue;
