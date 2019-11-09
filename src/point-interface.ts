export interface PointInterface {
    getX(): number;
    getY(): number;
    distanceTo(otherPoint: PointInterface): number;
}
