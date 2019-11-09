import {PointInterface} from "./point-interface";

export interface LocationInterface {
    getPoint(): PointInterface;

    getName(): string;

    getNumberOfCases(): number;

    getInspectionFrequency(): number;

    getInspectionCount(): number;

    canReinspect(): boolean;

    reinspect(): void;

    getHoursRequiredToInspect(): number;

    getRemainingHoursToInspect(): number;

    getTravelTimeTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;

    getDistanceTo(otherLocation: LocationInterface): number;

    inspect(hoursInspected: number): boolean;

    inspectFully(): boolean;
}
