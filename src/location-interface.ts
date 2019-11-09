import {PointInterface} from "./point-interface";

export interface LocationInterface {
    getPoint(): PointInterface;

    getName(): string;

    getHoursRequiredToInspect(): number;

    getTravelTimeTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;
}
