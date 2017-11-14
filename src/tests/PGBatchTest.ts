import { UsageStats } from "../UsageStats";

const pgp = require('pg-promise')({ noWarnings: true});
import {Document} from "../Document";

export class PGBatchTest {

	public static start(docs: Document[]) {
		let db = pgp({
			host: "localhost",
			port: 5432,
			user: "postgres",
			password: "test",
			database: "perf_test"
		});

		let start = new Date().getTime();

		return db.tx(t => {
			let inserts: Promise<void>[] = [];

			docs.forEach(doc => {
				inserts.push(t.none(`insert into document(id, \"docId\", label, context, distributions, date)
							values($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET 
								"docId" = EXCLUDED."docId",
                                label = EXCLUDED.label,
                                context = EXCLUDED.context,
                                distributions = EXCLUDED.distributions,
                                date = EXCLUDED.date`,
					[doc.id, doc.docId, doc.label, doc.context, JSON.stringify(doc.distributions), doc.date]))
			});

			return t.batch(inserts);
		}).then(() => {
			let end = new Date().getTime();

            console.log("[PG-Batch] Call to persist took " + (end - start) + " milliseconds.");
		})
	}
}
