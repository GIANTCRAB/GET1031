import {WorkData} from "./work-data";
import {InspectorWorker} from "./inspector-worker";
import {Point} from "./point";
import {Area} from "./area";

export class WorkSchedule {
    public workDataList: Set<WorkData> = new Set<WorkData>();
    public worker: InspectorWorker;
    public maxWorkHoursPerDay: number = 8;

    public canWork(day: number, area: Area, point: Point): boolean {
        const lastWorkDataForDay = this.getLastWorkDataForDay(day);
        let travelHoursToArea = 0;
        if (lastWorkDataForDay !== null) {
            // Check area travel distance/time
            travelHoursToArea = lastWorkDataForDay.area.travelTimeTo(area);
        }
        return this.getTotalWorkAndTravelHoursForDay(day) + travelHoursToArea + point.hoursRequiredToInspect <= this.maxWorkHoursPerDay;
    }

    public getTotalWorkAndTravelHoursForDay(day: number): number {
        return this.getTotalWorkHoursForDay(day) + this.getTotalTravelHoursForDay(day);
    }

    public work(day: number, area: Area, point: Point): WorkSchedule {
        const workData: WorkData = new WorkData();
        workData.day = day;
        workData.area = area;
        workData.point = point;
        this.workDataList = this.workDataList.add(workData);
        return this;
    }

    /**
     * Sort by day
     */
    public getSortedWorkData(): WorkData[] {
        return Array.from(this.workDataList)
            .sort((a: WorkData, b: WorkData) => {
                if (a.day < b.day) {
                    return -1;
                }
                if (a.day > b.day) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
    }

    private getTotalWorkHoursForDay(day: number): number {
        let totalWorkHoursForDay = 0;
        this.workDataList.forEach((workData: WorkData) => {
            if (workData.day === day) {
                totalWorkHoursForDay += workData.getWorkHours();
            }
        });

        return totalWorkHoursForDay;
    }

    private getLastWorkDataForDay(day: number): WorkData {
        let lastWorkData: WorkData = null;
        this.workDataList.forEach((workData: WorkData) => {
            if (workData.day === day) {
                lastWorkData = workData;
            }
        });

        return lastWorkData;
    }

    private getTotalTravelHoursForDay(day: number): number {
        let totalTravelHoursForDay = 0;
        let previousWorkData: WorkData = null;
        this.workDataList.forEach((workData: WorkData) => {
            if (workData.day === day) {
                if (previousWorkData !== null) {
                    totalTravelHoursForDay += workData.area.travelTimeTo(previousWorkData.area);
                }
                previousWorkData = workData;
            }
        });

        return totalTravelHoursForDay;
    }
}
