import { UsageStats } from "../UsageStats";

const pgp = require('pg-promise')({ noWarnings: true});
import {Document} from "../Document";

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
								\"docId\" =  $2,
								label = $3,
								context = $4,
								distributions = $5,
								date = $6`,
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
