import {Point} from "./point";

export class Area {
    public name: string;
    public points: Set<Point> = new Set<Point>();
    private center: Point = null;

    public getAreaCases(): number {
        let totalCases = 0;
        this.points.forEach((point: Point) => totalCases += point.numberOfCase);
        return totalCases;
    }

    public getInspectionFrequency(): number {
        return Math.ceil(this.getAreaCases() / 10);
    }

    public addPoint(point: Point): Area {
        this.points = this.points.add(point);
        this.center = this.calculateCenter();
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

    public getCenter(): Point {
        return this.center;
    }

    public distanceTo(otherArea: Area): number {
        if (this !== otherArea && this.getCenter() !== null && otherArea.getCenter() !== null) {
            return this.getCenter().distanceTo(otherArea.getCenter()) * 150;
        }

        return 0;
    }

    public travelTimeTo(otherArea: Area): number {
        if (this === otherArea) {
            // Same area has no travel time
            return 0;
        }
        // Min travel time: 1 hour
        const MIN_TRAVEL_TIME = 1;
        return Math.max(Math.floor(this.distanceTo(otherArea) * 0.1), MIN_TRAVEL_TIME);
    }

    public toArray(): Point[] {
        return Array.from(this.points);
    }

    private calculateCenter(): Point {
        let totalX = 0;
        let totalY = 0;

        this.points.forEach((point: Point) => {
            totalX += point.x;
            totalY += point.y;
        });

        const avgX = totalX / this.points.size;
        const avgY = totalY / this.points.size;

        const centerPoint: Point = new Point();
        centerPoint.x = avgX;
        centerPoint.y = avgY;

        return centerPoint;
    }
}
