import * as Sequelize from "sequelize";
import {Document} from "../Document";
import { UsageStats } from "../UsageStats";


export class SequelizeTest {
    public static start(docs: Document[]) : Promise<any> {
        const sequelize = new Sequelize("perf_test", "postgres", "", {
            host: "localhost",
            dialect: "postgres",
            logging: false,
            operatorsAliases: false
        });

        const Doc = sequelize.define('document', {
            id: {
                type: Sequelize.TEXT,
                primaryKey: true,
            },
            docId: Sequelize.TEXT,
            label: Sequelize.TEXT,
            context: Sequelize.TEXT,
            distributions: Sequelize.JSONB,
            date: Sequelize.DATE,
        }, {
            freezeTableName: true,
            timestamps: false
        });

        // workaround for bluebird Promises stuff..
        return new Promise((resolve, reject) => {
            let start = new Date().getTime();
            const us = new UsageStats();
            us.start();

            return sequelize.transaction(t => {
                return Doc.bulkCreate(docs, {
                    transaction: t
                });
            }).then(() => {
                let end = new Date().getTime();
                const stats = us.stop();

                console.log("[Sequelize] Call to persist took " + (end - start) + " milliseconds.");
                console.log(`
                    avg cpu: ${stats.avgCpu}
                    avg memory: ${stats.avgMemory}
                `);
                return resolve();
            }).catch(ex => {
                return reject(ex);
            }).finally(() => {
                sequelize.close();
            })
        });
    }
}
