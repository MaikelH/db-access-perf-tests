import * as usage from "usage";
import Timer = NodeJS.Timer;

export class UsageStats {
    private cpu :number[] = [];
    private memory: number[] = [];
    private interval: Timer;

    public start() {
        usage.clearHistory(process.pid);

        this.interval = setInterval(() => {
            usage.lookup(process.pid, { keepHistory: true }, (err, result) => {
                if( err ) {
                    throw new Error(err.message);
                }

                this.cpu.push(result.cpu);
                this.memory.push(result.memory);
            });
        }, 100);
    }

    public stop() {
        clearInterval(this.interval);

        return {
            avgCpu: this.cpu.reduce((a,b) => a+b, 0) / this.cpu.length,
            avgMemory: (this.memory.reduce((a,b) => a+b, 0) / this.memory.length) / 1024,

        }
    }
}
