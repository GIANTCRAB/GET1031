import {LocationInterface} from "./location-interface";
import PriorityQueue from "ts-priority-queue/src/PriorityQueue";

export class LocationList {
    private readonly locations: Set<LocationInterface> = new Set<LocationInterface>();

    public addLocation(location: LocationInterface) {
        this.locations.add(location);
    }

    public getList(): LocationInterface[] {
        return Array.from(this.locations);
    }

    public getByPriority(): LocationInterface[] {
        return this.getList()
            .sort((a: LocationInterface, b: LocationInterface) => {
                if (a.getNumberOfCases() > b.getNumberOfCases()) {
                    return -1;
                }
                if (a.getNumberOfCases() < b.getNumberOfCases()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
    }

    public getPriorityQueue(): PriorityQueue<LocationInterface> {
        const priorityList = this.getByPriority();
        const priorityQueue = new PriorityQueue({
            comparator: (a: LocationInterface, b: LocationInterface) => {
                if (a.getInspectionCount() < b.getInspectionCount()) {
                    return -1;
                }
                if (a.getInspectionCount() > b.getInspectionCount()) {
                    return 1;
                }

                // break even by number of cases
                if (a.getNumberOfCases() > b.getNumberOfCases()) {
                    return -1;
                }
                if (a.getNumberOfCases() < b.getNumberOfCases()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }
        });

        priorityList.forEach((location: LocationInterface) => priorityQueue.queue(location));

        return priorityQueue;
    }
}
