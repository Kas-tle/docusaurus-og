/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class WriteQueue extends EventEmitter {
    private q;
    private paused;
    private inFlightCntr;
    private maxConcurrent;
    constructor(concurrent?: number);
    addWrite(filePath: string, data: Buffer): void;
    addCopy(srcPath: string, destPath: string): void;
    private write;
    private err;
    waitForIdle(): Promise<void>;
}
