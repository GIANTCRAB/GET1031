export class Point {
    public name: string;
    public x: number;
    public y: number;

    public distanceTo(secondPoint: Point): number {
        return Math.hypot(this.x - secondPoint.x, this.y - secondPoint.y);
    }
}
