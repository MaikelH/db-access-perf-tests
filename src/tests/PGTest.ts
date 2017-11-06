import { UsageStats } from "../UsageStats";

const pgp = require('pg-promise')({ noWarnings: true});
import {Document} from "../Document";

/**
 * Very simple and naive test. This method should not be used in production.
 */
export class PGTest {

	public static start(docs: Document[]) {
		let db = pgp({
			host: "localhost",
			port: 5432,
			user: "postgres",
			password: "test",
			database: "perf_test"
		});

		let start = new Date().getTime();
        const us = new UsageStats();
        us.start();

		let inserts: Promise<void>[] = [];

		docs.forEach(doc => {
			inserts.push(db.none(`insert into document(id, \"docId\", label, context, distributions, date)
							values($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET 
                                "docsId" = EXCLUDED."docId",
                                label = EXCLUDED.label,
                                context = EXCLUDED.context,
                                distributions = EXCLUDED.distributions,
                                date = EXCLUDED.date`,
							[doc.id, doc.docId, doc.label, doc.context, JSON.stringify(doc.distributions), doc.date]))
		});

		Promise.all(inserts)
			.then(doc => {
				let end = new Date().getTime();
                const stats = us.stop();


                console.log("[PG-Promise] Call to persist took " + (end - start) + " milliseconds.");
                // console.log(`
                //     avg cpu: ${stats.avgCpu}
                //     avg memory: ${stats.avgMemory}
                // `);

                pgp.end();
			})
	}
}
