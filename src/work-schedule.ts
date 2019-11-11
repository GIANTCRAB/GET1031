import {WorkData} from "./work-data";
import {InspectorWorker} from "./inspector-worker";
import {WorkUnitInterface} from "./work-unit-interface";
import {LocationInterface} from "./location-interface";
import {TravelData} from "./travel-data";

export class WorkSchedule {
    public workUnitList: Set<WorkUnitInterface> = new Set<WorkUnitInterface>();
    public maxWorkHoursPerDay: number = 8;

    public canWork(inspectorWorker: InspectorWorker, day: number, location: LocationInterface): boolean {
        const lastWorkUnitForDay = this.getLastWorkDataForDay(inspectorWorker, day);
        let travelHours = 0;
        if (lastWorkUnitForDay !== null) {
            if (lastWorkUnitForDay.location === location) {
                return false;
            }
            // Check area travel distance/time
            travelHours = lastWorkUnitForDay.location.getTravelTimeTo(location);
        }

        // make sure travel time doesn't take up everything
        const totalWorkUnitHoursForDay = this.getTotalWorkUnitHoursForDay(inspectorWorker, day);
        const totalHoursForDayAndNewLocationTravel = totalWorkUnitHoursForDay + travelHours;
        return totalHoursForDayAndNewLocationTravel < this.maxWorkHoursPerDay;
    }

    public workAndGetRemainingHours(inspectorWorker: InspectorWorker, day: number, location: LocationInterface): number {
        const lastWorkUnitForDay = this.getLastWorkDataForDay(inspectorWorker, day);
        let travelHours = 0;
        if (lastWorkUnitForDay !== null) {
            // Check area travel distance/time
            travelHours = lastWorkUnitForDay.location.getTravelTimeTo(location);
        }

        const totalWorkUnitHoursForDay = this.getTotalWorkUnitHoursForDay(inspectorWorker, day);
        // check for remaining hours
        const workerRemainingHours = this.maxWorkHoursPerDay - (totalWorkUnitHoursForDay + travelHours + location.getRemainingHoursToInspect());
        if (lastWorkUnitForDay !== null && lastWorkUnitForDay.location !== location) {
            const travelData: WorkUnitInterface = new TravelData(lastWorkUnitForDay.location, location, inspectorWorker, day);
            this.workUnitList.add(travelData);
        }
        if (workerRemainingHours < 0) {
            // NEGATIVE hours - need to break up workload
            // retrieve hours that left to inspect
            const hoursInspected = location.getRemainingHoursToInspect() + workerRemainingHours;
            const workData: WorkUnitInterface = new WorkData(location, inspectorWorker, day, hoursInspected);
            location.inspect(hoursInspected);
            this.workUnitList.add(workData);
        } else {
            const workData: WorkUnitInterface = new WorkData(location, inspectorWorker, day, location.getRemainingHoursToInspect());
            location.inspectFully();
            this.workUnitList.add(workData);
        }

        return workerRemainingHours;
    }

    public getTotalWorkUnitHoursForDay(inspectorWorker: InspectorWorker, day: number): number {
        let totalWorkUnitHoursForDay = 0;
        this.workUnitList.forEach((workUnit: WorkUnitInterface) => {
            if (workUnit.day === day && workUnit.inspectorWorker === inspectorWorker) {
                totalWorkUnitHoursForDay += workUnit.getHours();
            }
        });

        return totalWorkUnitHoursForDay;
    }

    public getWorkSchedule(): WorkUnitInterface[][] {
        const workUnitInterface: WorkUnitInterface[][] = [[]];
        Array.from(this.workUnitList).forEach((workUnit: WorkUnitInterface) => {
            if (!workUnitInterface[workUnit.day]) {
                workUnitInterface[workUnit.day] = [];
            }
            workUnitInterface[workUnit.day].push(workUnit);
        });

        return workUnitInterface;
    }

    private getLastWorkDataForDay(inspectorWorker: InspectorWorker, day: number): WorkData {
        let lastWorkUnit: WorkData = null;
        this.workUnitList.forEach((workUnit: WorkUnitInterface) => {
            if (workUnit instanceof WorkData && workUnit.day === day && workUnit.inspectorWorker === inspectorWorker) {
                lastWorkUnit = workUnit;
            }
        });

        return lastWorkUnit;
    }
}
