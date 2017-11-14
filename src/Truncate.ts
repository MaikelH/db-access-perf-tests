const pgp = require('pg-promise')();

export class Truncate {
	private db;

	constructor() {
        this.db = pgp({
            host: "localhost",
            port: 5432,
            user: "postgres",
            password: "test",
            database: "perf_test"
        });
	}

	public truncate() : Promise<void> {
		return this.db.none("TRUNCATE document");
	}
}