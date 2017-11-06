import {UsageStats} from "../UsageStats";

const pgp = require('pg-promise')();
import {Document} from "../Document";

const db = pgp({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "perf_test"
});

const cs = new pgp.helpers.ColumnSet(["id", "docId", "label", "context", "distributions:json", "date"],
    {table: 'document'});

export class PGCustomInsertTest {

    public static start(docs: Document[]) {

        const start = Date.now();
        const us = new UsageStats();
        us.start();

        const sql = pgp.helpers.insert(docs, cs); // No conflict resolution? - see the other PR I did ;)

        return db.query(sql)
            .then(() => {
                const duration = Date.now() - start;
                const stats = us.stop();


                console.log("[PG-InsertHelper] Call to persist took " + duration + " milliseconds.");
                //     console.log(`
                //     avg cpu: ${stats.avgCpu}
                //     avg memory: ${stats.avgMemory}
                // `);

                pgp.end();
            })
    }
}
