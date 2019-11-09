import {PointInterface} from "./point-interface";

export class Point implements PointInterface {
    private readonly x: number;
    private readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public distanceTo(secondPoint: PointInterface): number {
        const DISTANCE_MULTIPLIER = 150;
        return Math.hypot(this.getX() - secondPoint.getX(), this.getY() - secondPoint.getY()) * DISTANCE_MULTIPLIER;
    }
}
