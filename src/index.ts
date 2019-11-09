import * as fs from "fs";
import * as stringify from "csv-stringify";
import {Point} from "./point";
import {CsvParser} from "./csv-parser";
import {InspectorWorker} from "./inspector-worker";
import {WorkSchedule} from "./work-schedule";
import {WorkData} from "./work-data";
import {LocationInterface} from "./location-interface";
import {PointInterface} from "./point-interface";
import {Location} from "./location";
import {LocationList} from "./location-list";
import {WorkUnitInterface} from "./work-unit-interface";
import {TravelData} from "./travel-data";


// populate all points

const locationList: LocationList = new LocationList();

const csvParser: CsvParser = new CsvParser();
csvParser.textToParse = fs.readFileSync("data.csv", {}).toString();

const preParsedText = csvParser.toArray();
preParsedText.forEach((value: string[]) => {
    if (!(typeof value[0] === 'undefined' || typeof value[1] === 'undefined')) {
        /**
         * first column is name
         * second column is "x,y"
         * third column is hours to inspect location
         * fourth column is number of dengue cases
         **/
        const coordinates: string[] = value[1].split(",");
        const pointToAdd: PointInterface = new Point(Number(coordinates[0]), Number(coordinates[1]));
        const locationToAdd: LocationInterface = new Location(pointToAdd, value[0], Number(value[2]), Number(value[3]));

        locationList.addLocation(locationToAdd);
    }
});

// Generate travel time table
const outputData: string[][] = [];
let locationListCopy = locationList.getList();
locationList.getList().forEach((location: LocationInterface) => {
    locationListCopy.forEach((secondLocation: LocationInterface) => {
        const calculatedTravelTime = location.getTravelTimeTo(secondLocation);
        if (location !== secondLocation) {
            outputData.push([
                location.getName(),
                secondLocation.getName(),
                calculatedTravelTime.toString()
            ]);
        }
    });
    // Remove it from list since it is already in distance table
    locationListCopy = locationListCopy.filter(item => item !== location);
});

stringify(outputData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('travel-table.csv', output, (err) => {
        if (err) throw err;
        console.log('travel-table.csv saved.');
    });
});

// Generate workers
const numberOfWorkers = 5;
const inspectorWorkerList: InspectorWorker[] = [];

for (let i = 0; i < numberOfWorkers; i++) {
    const inspectorWorker: InspectorWorker = new InspectorWorker();
    inspectorWorker.id = i + 1;
    inspectorWorkerList.push(inspectorWorker);
}

const workSchedule = new WorkSchedule();

// loop through sorted areas, which are sorted by number of cases in area
locationList.getByPriority().forEach((location: LocationInterface) => {
    // loop through days
    let currentDay = 1;
    let remainingHours = -(location.getRemainingHoursToInspect());

    while (remainingHours < 0) {
        inspectorWorkerList.every((inspectorWorker: InspectorWorker) => {
            if (workSchedule.canWork(inspectorWorker, currentDay, location)) {
                remainingHours = workSchedule.workAndGetRemainingHours(inspectorWorker, currentDay, location);
                if (remainingHours >= 0) {
                    // work completed
                    return false;
                }
            }

            return true;
        });
        // go next day since no workers can work on the current day
        currentDay++;
    }
});

// Generate schedule
const scheduleData: string[][] = [];
workSchedule.getWorkSchedule().forEach((workUnitForDay: WorkUnitInterface[]) => {
    workUnitForDay.forEach((workUnit: WorkUnitInterface) => {
        if (workUnit instanceof WorkData) {
            const workData: WorkData = workUnit;
            scheduleData.push([
                "WORK",
                "DAY " + workData.day,
                workData.inspectorWorker.id.toString(),
                workData.location.getName(),
                "HOURS: " + workData.getHours().toString()
            ]);
        }
        if (workUnit instanceof TravelData) {
            const travelData: TravelData = workUnit;
            scheduleData.push([
                "TRAVEL",
                "DAY " + travelData.day,
                travelData.inspectorWorker.id.toString(),
                travelData.startLocation.getName(),
                travelData.endLocation.getName(),
                "HOURS: " + travelData.getHours().toString()
            ]);
        }
    });
});

stringify(scheduleData, {}, (err, output) => {
    if (err) throw err;
    fs.writeFile('schedule.csv', output, (err) => {
        if (err) throw err;
        console.log('schedule.csv saved.');
    });
});
