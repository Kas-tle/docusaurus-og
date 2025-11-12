import { EventEmitter } from 'events';
import fs from 'fs';
import logger from '@docusaurus/logger'

export class WriteQueue extends EventEmitter {
    private q: Array<{
        operation: 'write';
        filePath: string;
        data: Buffer;
    } | {
        operation: 'copy';
        srcPath: string;
        destPath: string;
    }>;
    private paused: boolean;
    private inFlightCntr: number;
    private maxConcurrent: number;

    constructor(concurrent = 10) {
        super();
        this.q = [];
        this.paused = false;
        this.inFlightCntr = 0;
        this.maxConcurrent = concurrent;
    }

    public addWrite(filePath: string, data: Buffer) {
        this.q.push({ operation: 'write', filePath, data });
        this.write();
    }

    public addCopy(srcPath: string, destPath: string) {
        this.q.push({ operation: 'copy', srcPath, destPath });
        this.write();
    }

    private write() {
        while (!this.paused && this.q.length && this.inFlightCntr < this.maxConcurrent) {
            this.inFlightCntr++;
            let item = this.q.shift();
            if (!item) {
                this.inFlightCntr--;
                return;
            };
            try {
                switch (item.operation) {
                    case 'copy':
                        fs.copyFile(item.srcPath, item.destPath, _err => {
                            this.inFlightCntr--;
                            this.write();
                        });
                        break;
                    case 'write':
                        fs.writeFile(item.filePath as string, item.data as Uint8Array, _err => {
                            this.inFlightCntr--;
                            this.write();
                        });
                        break;
                    default:
                        throw new Error(`Unknown operation: ${(item as any).operation}`);
                }
            } catch(e) {
                this.err(e);
            }
        }
    }

    private err(e: unknown) {
        logger.error(e);
    }

    public waitForIdle(): Promise<void> {
        return new Promise((resolve) => {
            const checkIdle = () => {
                if (this.q.length === 0 && this.inFlightCntr === 0) {
                    resolve();
                } else {
                    setTimeout(checkIdle, 50);
                }
            };
            checkIdle();
        });
    }
}