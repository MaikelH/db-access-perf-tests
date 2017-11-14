import {createConnection, Repository, Connection} from "typeorm";
import {Document} from "../Document";
export class TypeormSave {
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

			return con.transaction(tx =>
                            tx.save(docs)
                                .then(doc => {
                                    let end = new Date().getTime();

                                    console.log("[TypeormSave] Call to persist took " + (end - start) + " milliseconds.");
                                })
			).then(() => {
			    return con.close();
            })
		})
	}
}