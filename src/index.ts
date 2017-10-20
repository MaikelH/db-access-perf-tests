import {Document} from "./Document";
import {TypeormTest} from "./tests/TypeormTest";
import {PGTest} from "./tests/PGTest";
import {Truncate} from "./Truncate";
import {PGBatchTest} from "./tests/PGBatchTest";
import { PGCustomInsertTest } from "./tests/PGCustomInsertTest";
import { SequelizeTest } from "./tests/SequelizeTest";

const moment = require("moment");

const documents : Document[] = [];

for(let i = 0; i < 16000; i++) {
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

let truncator = new Truncate();


PGBatchTest.start(documents)
	.then(() => truncator.truncate())
	.then(() => TypeormTest.start(documents))
	.then(() => truncator.truncate())
	.then(() => PGTest.start(documents))
	.then(() => truncator.truncate())
    .then(() => PGCustomInsertTest.start(documents))
    .then(() => truncator.truncate())
	.then( () => SequelizeTest.start(documents))
    .then(() => truncator.truncate())

	.then(() => {
        console.log("Finished test.");
        process.exit();
    })
	.catch(ex => {
		console.error(ex);
	});

