import * as fs from "fs";
import * as stringify from "csv-stringify";
import {Point} from "./point";
import {CsvParser} from "./csv-parser";
import {InspectorWorker} from "./inspector-worker";
import {AreaList} from "./area-list";


// populate all points

const pointList: Point[] = [];

const csvParser: CsvParser = new CsvParser();
csvParser.textToParse = fs.readFileSync("data.csv", {}).toString();

const preParsedText = csvParser.toArray();
preParsedText.forEach((value: string[]) => {
    if (!(typeof value[0] === 'undefined' || typeof value[1] === 'undefined')) {
        const pointToAdd: Point = new Point();
        // first column is name
        // second column is "x,y"
        pointToAdd.name = value[0];
        const coordinates: string[] = value[1].split(",");
        pointToAdd.x = Number(coordinates[0]);
        pointToAdd.y = Number(coordinates[1]);

        pointList.push(pointToAdd);
    }
});

// TODO: Add inspection hours and number of cases to point list

// TODO:

// Generate distance table

const areaList: AreaList = new AreaList();
const outputData: string[][] = [];
pointList.forEach((point: Point) => {
    pointList.forEach((secondPoint: Point) => {
        const calculatedDistance = (point.distanceTo(secondPoint) * 150);
        // Add the point the areaList
        areaList.addPoint(secondPoint);
        if (point !== secondPoint) {
            outputData.push([
                point.name,
                secondPoint.name,
                calculatedDistance.toFixed(2)
            ]);
        }
    });
});

fs.writeFile('data.json', JSON.stringify(areaList.toArray()), (err) => {
    if (err) throw err;
    console.log('area saved.');
});

stringify(outputData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('my.csv', output, (err) => {
        if (err) throw err;
        console.log('my.csv saved.');
    });
});


// Generate workers
const MAX_HOURS = 8;
const numberOfWorkers = 2;

const inspectorWorkerList: InspectorWorker[] = [];
for (let i = 0; i < numberOfWorkers; i++) {
    const inspectorWorker: InspectorWorker = new InspectorWorker();
    inspectorWorker.id = i + 1;
    inspectorWorkerList.push(inspectorWorker);
}

// Generate schedule
