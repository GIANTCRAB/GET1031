import {Point} from "./point";
import {Area} from "./area";

export class WorkData {
    public point: Point;
    public area: Area;
    public day: number;

    public getWorkHours(): number {
        return this.point.hoursRequiredToInspect;
    }
}
