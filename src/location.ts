import {PointInterface} from "./point-interface";
import {LocationInterface} from "./location-interface";

export class Location implements LocationInterface {
    private readonly point: PointInterface;
    private readonly name: string;
    private readonly numberOfCases: number;
    private readonly hoursRequiredToInspect: number;

    constructor(point: PointInterface, name: string, numberOfCases: number, hoursRequiredToInspect: number) {
        this.point = point;
        this.name = name;
        this.numberOfCases = numberOfCases;
        this.hoursRequiredToInspect = hoursRequiredToInspect;
    }

    public getPoint(): PointInterface {
        return this.point;
    }

    public getName(): string {
        return this.name;
    }

    public getHoursRequiredToInspect(): number {
        return this.hoursRequiredToInspect;
    }

    public getTravelTimeTo(otherLocation: LocationInterface): number {
        if (this.getPoint() === otherLocation.getPoint()) {
            return 0;
        }
        // Min travel time: 1 hour
        const MIN_TRAVEL_TIME = 1;

        return Math.max(Math.floor(this.getDistanceTo(otherLocation) * 0.1), MIN_TRAVEL_TIME);
    }

    public getDistanceTo(otherLocation: LocationInterface): number {
        return this.getPoint().distanceTo(otherLocation.getPoint());
    }
}
