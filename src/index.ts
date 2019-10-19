import * as fs from "fs";
import * as stringify from "csv-stringify";
import {Point} from "./point";
import {CsvParser} from "./csv-parser";


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

const outputData: string[][] = [];
pointList.forEach((point: Point) => {
    pointList.forEach((secondPoint: Point) => {
        if (point !== secondPoint) {
            outputData.push([
                point.name,
                secondPoint.name,
                (point.distanceTo(secondPoint) * 50).toFixed(2).toString()
            ]);
        }
    });
});

stringify(outputData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('my.csv', output, (err) => {
        if (err) throw err;
        console.log('my.csv saved.');
    });
});
