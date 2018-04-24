import {Document} from "./Document";
import { TypeormSave } from "./tests/TypeormSave";
import {PGTest} from "./tests/PGTest";
import {Truncate} from "./Truncate";
import {PGBatchTest} from "./tests/PGBatchTest";
import { PGCustomInsertTest } from "./tests/PGCustomInsertTest";
import { SequelizeTest } from "./tests/SequelizeTest";
import { TypeormInsert } from "./tests/TypeormInsert";
import { SequelizeTypescript } from "./tests/SequelizeTypescript";

const moment = require("moment");

const documents : Document[] = [];

const runs = 1;

for(let i = 0; i < 8000; i++) {
	let doc = new Document();

	doc.id = i.toString();
	doc.docId = "label/" + i;
	doc.context = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel faucibus nunc. Etiam volutpat vel urna in scelerisque. Cras a erat ipsum. ";
	doc.label = "label/" + i;
	doc.distributions = [
		{
			weight: "0.9",
			id: i,
			docId: i
		},
		{
			weight: "0.23123",
			id: i,
			docId: i
		},
		{
			weight: "0.12312",
			id: i,
			docId: i
		}
	];
	doc.date = moment().toDate();

	documents.push(doc);
}

start()
    .then(() => {
		console.log("Finished test.");
		process.exit();
	})
    .catch(ex => {
		console.error(ex);
	});

async function start() {
	let truncator = new Truncate();

	for( let i = 1; i <= runs; i++) {

		console.log(`### Run ${i}`);
        await PGBatchTest.start(documents);
        await truncator.truncate();
        await TypeormInsert.start(documents);
        await truncator.truncate();
        await TypeormSave.start(documents);
        await truncator.truncate();
        await PGTest.start(documents);
        await truncator.truncate();
        await PGCustomInsertTest.start(documents);
        await truncator.truncate();
        await SequelizeTypescript.start(documents as any)
        await truncator.truncate();
        await SequelizeTest.start(documents);
        await truncator.truncate();
	}
}



