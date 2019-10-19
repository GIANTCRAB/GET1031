import {Point} from "./point";
import {InspectorWorker} from "./inspector-worker";

export class WorkData {
    public point: Point;
    public worker: InspectorWorker;
    public hours: number;
    public day: number;
}
