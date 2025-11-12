/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Queue extends EventEmitter {
    private q;
    private paused;
    private inFlightCntr;
    private fileCntr;
    private maxConcurrent;
    private basePath;
    constructor(basePath: string, baseIndex: number, concurrent?: number);
    add(data: Buffer): void;
    write(): void;
    err(e: unknown): void;
    pause(): void;
    resume(): void;
}
