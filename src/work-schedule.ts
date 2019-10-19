import {WorkData} from "./work-data";
import {InspectorWorker} from "./inspector-worker";
import {Point} from "./point";

export class WorkSchedule {
    public workDataList: Set<WorkData> = new Set<WorkData>();
    public worker: InspectorWorker;
    public maxWorkHoursPerDay: number = 8;

    public canWork(day: number, point: Point): boolean {
        return this.getTotalWorkHoursForDay(day) + point.hoursRequiredToInspect <= this.maxWorkHoursPerDay;
    }

    public getTotalWorkHoursForDay(day: number): number {
        let totalWorkHoursForDay = 0;
        this.workDataList.forEach((workData: WorkData) => {
            if (workData.day === day) {
                totalWorkHoursForDay += workData.getWorkHours();
            }
        });

        return totalWorkHoursForDay;
    }

    public work(day: number, point: Point): WorkSchedule {
        const workData: WorkData = new WorkData();
        workData.day = day;
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
}
