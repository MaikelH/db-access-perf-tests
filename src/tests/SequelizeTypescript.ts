import { Column, DataType, Model, Sequelize, Table } from "sequelize-typescript";

export class SequelizeTypescript {
    public  static async start(docs: Document[]) : Promise<any> {
        const sequelize = new Sequelize({
            database: 'perf_test',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'test',
            dialect: "postgres",
            logging: false,
        });

        await sequelize.authenticate();

        sequelize.addModels([
            Document
        ]);

        await Document.sync();

        let start = new Date().getTime();
        return Document.bulkCreate(docs)
            .then(() => {
                let end = new Date().getTime();

                console.log("[Sequelize-Typescript] Call to persist took " + (end - start) + " milliseconds.");
            })
            .then(() => sequelize.close());
    }
}

@Table({
    timestamps: false,
    tableName: 'document'
})
export class Document extends Model<Document> {
    @Column({ type: DataType.TEXT, primaryKey: true})
    id: string;

    @Column({ type: DataType.TEXT})
    docId: string;

    @Column({ type: DataType.TEXT})
    label: string;

    @Column({ type: DataType.TEXT})
    context: string;

    @Column({ type: DataType.JSONB})
    distributions: Distribution[];

    @Column({ type: DataType.TIME})
    date: Date;
}

export interface Distribution {
    weight: string,
    id: number,
    docId: number
}