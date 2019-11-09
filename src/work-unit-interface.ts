import {InspectorWorker} from "./inspector-worker";

export interface WorkUnitInterface {
    readonly day: number;
    readonly inspectorWorker: InspectorWorker;

    getHours(): number;
}
