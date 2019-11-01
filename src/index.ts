import * as fs from "fs";
import * as stringify from "csv-stringify";
import {Point} from "./point";
import {CsvParser} from "./csv-parser";
import {InspectorWorker} from "./inspector-worker";
import {AreaList} from "./area-list";
import {Area} from "./area";
import {WorkSchedule} from "./work-schedule";
import {WorkData} from "./work-data";


// populate all points

const pointList: Point[] = [];

const csvParser: CsvParser = new CsvParser();
csvParser.textToParse = fs.readFileSync("data.csv", {}).toString();

const preParsedText = csvParser.toArray();
preParsedText.forEach((value: string[]) => {
    if (!(typeof value[0] === 'undefined' || typeof value[1] === 'undefined')) {
        const pointToAdd: Point = new Point();
        // first column is name
        pointToAdd.name = value[0];
        // second column is "x,y"
        const coordinates: string[] = value[1].split(",");
        pointToAdd.x = Number(coordinates[0]);
        pointToAdd.y = Number(coordinates[1]);
        // third column is hours to inspect location
        pointToAdd.hoursRequiredToInspect = Number(value[2]);
        // fourth column is number of dengue cases
        pointToAdd.numberOfCase = Number(value[3]);

        pointList.push(pointToAdd);
    }
});

// Generate distance table
const areaList: AreaList = new AreaList();
const outputData: string[][] = [];
let pointListCopy = pointList;
pointList.forEach((point: Point) => {
    pointListCopy.forEach((secondPoint: Point) => {
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
    // Remove it from list since it is already in distance table
    pointListCopy = pointListCopy.filter(item => item !== point);
});

fs.writeFile('data.json', JSON.stringify(areaList.toArray()), (err) => {
    if (err) throw err;
    console.log('area saved.');
});

stringify(outputData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('distance-table.csv', output, (err) => {
        if (err) throw err;
        console.log('distance-table.csv saved.');
    });
});

// Generate distance table for area
const areaOutputData: string[][] = [];
const areaListAreasCopy = areaList.areas;
areaList.areas.forEach((area: Area) => {
    areaListAreasCopy.forEach((otherArea: Area) => {
        if (area !== otherArea) {
            const calculatedDistance = area.distanceTo(otherArea);
            areaOutputData.push([
                area.name,
                otherArea.name,
                calculatedDistance.toFixed(2)
            ]);
        }
    });
    areaListAreasCopy.delete(area);
});

stringify(areaOutputData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('area-distance-table.csv', output, (err) => {
        if (err) throw err;
        console.log('area-distance-table.csv saved.');
    });
});


// Generate workers
const numberOfWorkers = 2;

const inspectorWorkerScheduleList: WorkSchedule[] = [];
for (let i = 0; i < numberOfWorkers; i++) {
    const inspectorWorker: InspectorWorker = new InspectorWorker();
    inspectorWorker.id = i + 1;
    const inspectorWorkerSchedule: WorkSchedule = new WorkSchedule();
    inspectorWorkerSchedule.worker = inspectorWorker;
    inspectorWorkerScheduleList.push(inspectorWorkerSchedule);
}

stringify(areaList.toArray(), {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('sorted.csv', output, (err) => {
        if (err) throw err;
        console.log('sorted.csv saved.');
    });
});

// loop through sorted areas, which are sorted by number of cases in area
areaList.getSortedAreas().forEach((area: Area) => {
    area.points.forEach((point: Point) => {
        // loop through days
        let currentDay = 1;
        let availableWorkerSchedule: WorkSchedule = null;

        while (availableWorkerSchedule === null) {
            inspectorWorkerScheduleList.every((inspectorWorkerSchedule: WorkSchedule) => {
                if (inspectorWorkerSchedule.canWork(currentDay, point)) {
                    availableWorkerSchedule = inspectorWorkerSchedule.work(currentDay, area, point);
                    return false;
                }

                return true;
            });
            // go next day since no workers can work on the current day
            currentDay++;
        }
    });
});

// Generate schedule
const scheduleData: string[][] = [];
inspectorWorkerScheduleList.forEach((inspectorWorkerSchedule: WorkSchedule) => {
    const workerData: string[] = [
        inspectorWorkerSchedule.worker.id.toString()
    ];
    let startingDay = 1;
    let startingColumn = [];
    inspectorWorkerSchedule.getSortedWorkData().forEach((sortedWorkData: WorkData) => {
        if (sortedWorkData.day !== startingDay) {
            workerData.push(startingColumn.join(","));
            startingColumn = [];
            // start a new
            startingDay = sortedWorkData.day;
        }

        startingColumn.push(sortedWorkData.area.name + ": " + sortedWorkData.point.name);
    });
    workerData.push(startingColumn.join(","));

    scheduleData.push(workerData);
});

stringify(scheduleData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('schedule.csv', output, (err) => {
        if (err) throw err;
        console.log('schedule.csv saved.');
    });
});
