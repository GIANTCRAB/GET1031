import {Point} from "./point";

export class Area {
    public points: Set<Point> = new Set<Point>();

    public getAreaCases(): number {
        let totalCases = 0;
        this.points.forEach((point: Point) => totalCases + point.numberOfCase);
        return totalCases;
    }

    public addPoint(point: Point): Area {
        this.points = this.points.add(point);
        return this;
    }

    public checkPointInRange(checkingPoint: Point): boolean {
        let inRange: boolean = false;

        this.points.forEach((point: Point) => {
            const calculatedDistance = (point.distanceTo(checkingPoint) * 150);
            if (calculatedDistance <= 1.0) {
                inRange = true;
                return;
            }
        });

        return inRange;
    }

    public toArray(): Point[] {
        return Array.from(this.points);
    }
}
