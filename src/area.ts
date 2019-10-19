import {Point} from "./point";

export class Area {
    public points: Point[];

    public getAreaCases(): number {
        let totalCases = 0;
        this.points.forEach((point: Point) => totalCases + point.numberOfCase);
        return totalCases;
    }
}
