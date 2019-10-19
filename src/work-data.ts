import {Point} from "./point";

export class WorkData {
    public point: Point;
    public day: number;

    public getWorkHours(): number {
        return this.point.hoursRequiredToInspect;
    }
}
