export class InspectorWorker {
    public id: number;
    public workHours: number = 0;
    public maxWorkHours: number = 8;

    public canWork(): boolean {
        return this.workHours <= this.maxWorkHours;
    }
}
