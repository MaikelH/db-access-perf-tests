import {createConnection, Repository, Connection} from "typeorm";
import {Document} from "../Document";
export class TypeormInsert {
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

        // Using insert on QueryBuilder (see comment by @pleerock
        // https://github.com/typeorm/typeorm/issues/1115#issuecomment-343125550
        return db.then((con: Connection) => {
            let start = new Date().getTime();

            return con.createQueryBuilder()
                .insert()
                .into(Document)
                .values(docs)
                // .useTransaction(true) // completely optional since now you must have only one insertion query with bulk insertion
                .execute()
                .then(doc => {
                    let end = new Date().getTime();

                    console.log("[TypeormInsert] Call to persist took " + (end - start) + " milliseconds.");
                })
                .then(() => {
                    return con.close();
                });
        });
    }
}