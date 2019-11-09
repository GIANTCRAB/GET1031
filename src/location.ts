import {PointInterface} from "./point-interface";

export class Location {
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

    public getTravelTimeTo(otherLocation: Location): number {
        if (this === otherLocation) {
            return 0;
        }
        // Min travel time: 1 hour
        const MIN_TRAVEL_TIME = 1;

        return Math.max(Math.floor(this.getDistanceTo(otherLocation) * 0.1), MIN_TRAVEL_TIME);
    }

    private getDistanceTo(otherLocation: Location): number {
        return this.getPoint().distanceTo(otherLocation.getPoint());
    }

    private getPoint(): PointInterface {
        return this.point;
    }
}
