import {PointInterface} from "./point-interface";

export interface LocationInterface {
    getPoint(): PointInterface;

    getName(): string;

    getHoursRequiredToInspect(): number;

    getRemainingHoursToInspect(): number;

    getTravelTimeTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;

    inspect(hoursInspected: number): boolean;

    inspectFully(): boolean;
}
