import {WorkUnitInterface} from "./work-unit-interface";
import {LocationInterface} from "./location-interface";
import {InspectorWorker} from "./inspector-worker";

export class TravelData implements WorkUnitInterface {
    public readonly startLocation: LocationInterface;
    public readonly endLocation: LocationInterface;
    public readonly inspectorWorker: InspectorWorker;
    public readonly day: number;

    constructor(startLocation: LocationInterface, endLocation: LocationInterface, inspectorWorker: InspectorWorker, day: number) {
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.inspectorWorker = inspectorWorker;
        this.day = day;
    }

    public getHours(): number {
        return this.startLocation.getTravelTimeTo(this.endLocation);
    }
}
