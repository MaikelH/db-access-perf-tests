import {createConnection, Repository, Connection} from "typeorm";
import {Document} from "../Document";
import { UsageStats } from "../UsageStats";

export class TypeormTest {
	public static start(docs: Document[]) : Promise<any> {
		let db = createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "test",
            database: "perf_test",
			entities: [
				Document
			]
		}).catch(console.error);



		return db.then((con: Connection) => {
            let start = new Date().getTime();
            const us = new UsageStats();
            us.start();

			return con.transaction(tx =>
                            tx.save(docs)
                                .then(doc => {
                                    let end = new Date().getTime();
                                    const stats = us.stop();

                                    console.log("[Typeorm] Call to persist took " + (end - start) + " milliseconds.");
                                    console.log(`
                                    	avg cpu: ${stats.avgCpu}
                                    	avg memory: ${stats.avgMemory}
									`)
                                })
			)
		})
	}
}