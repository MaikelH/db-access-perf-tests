const pgp = require('pg-promise')({ noWarnings: true});
import {Document} from "../Document";

export class PGCustomInsertTest {

	public static start(docs: Document[]) {
		let db = pgp({
			host: "localhost",
			port: 5432,
			user: "postgres",
			password: "test",
			database: "perf_test"
		});

		const columnSet = pgp.helpers.ColumnSet([ "id", "docId", "label", "context", "distributions:json", "date"],
                                                    { table: 'document'});

		let start = new Date().getTime();

		const queryString = pgp.helpers.insert(docs, columnSet);
		return db.query(queryString)
                .then(() => {
                    let end = new Date().getTime();

                    console.log("[PG-InsertHelper] Call to persist took " + (end - start) + " milliseconds.");

                    pgp.end();
                })
	}
}
