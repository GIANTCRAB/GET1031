import {LocationInterface} from "./location-interface";
import {InspectorWorker} from "./inspector-worker";
import {WorkUnitInterface} from "./work-unit-interface";

export class WorkData implements WorkUnitInterface {
    public readonly location: LocationInterface;
    public readonly inspectorWorker: InspectorWorker;
    public readonly day: number;
    private readonly hours: number;

    constructor(location: LocationInterface, inspectorWorker: InspectorWorker, day: number, hours: number) {
        this.location = location;
        this.inspectorWorker = inspectorWorker;
        this.day = day;
        this.hours = hours;
    }

    getHours(): number {
        return this.hours;
    }
}
