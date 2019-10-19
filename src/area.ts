import {Point} from "./point";

export class Area {
    public points: Set<Point>;

    public getAreaCases(): number {
        let totalCases = 0;
        this.points.forEach((point: Point) => totalCases + point.numberOfCase);
        return totalCases;
    }

    public addPoint(point: Point): Area {
        this.points.add(point);
        return this;
    }
}
