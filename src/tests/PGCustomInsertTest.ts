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

        // New syntax in pg-promise 7.3 to support excludes (thanks to @vitaly-t)
        const sql = pgp.helpers.insert(docs, cs) +
                            ' ON CONFLICT (id) DO UPDATE SET ' +
                            cs.assignColumns({from: 'EXCLUDED', skip: 'id'});

        return db.query(sql)
            .then(() => {
                const duration = Date.now() - start;


                console.log("[PG-InsertHelper] Call to persist took " + duration + " milliseconds.");
            })
    }
}
