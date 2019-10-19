import {Area} from "./area";
import {Point} from "./point";

export class AreaList {
    public areas: Set<Area> = new Set<Area>();

    public addArea(area: Area): AreaList {
        this.areas = this.areas.add(area);
        return this;
    }

    public addPoint(point: Point): AreaList {
        const area: Area = this.checkAreaPointExists(point);
        if (area !== null) {
            this.addArea(area.addPoint(point));
        } else {
            const newArea: Area = new Area();
            this.addArea(newArea.addPoint(point));
        }

        return this;
    }

    public checkAreaPointExists(point: Point): Area {
        let foundArea: Area = null;

        this.areas.forEach((area: Area) => {
            if (area.checkPointInRange(point)) {
                foundArea = area;
                return;
            }
        });

        return foundArea;
    }

    public toArray(): Point[][] {
        const combinedArray: Point[][] = [];
        this.areas.forEach((area: Area) => combinedArray.push(area.toArray()));

        return combinedArray;
    }

    public getSortedAreas(): Area[] {
        return Array.from(this.areas).sort((a: Area, b: Area) => {
            if (a.getAreaCases() < b.getAreaCases()) {
                return -1;
            }
            if (a.getAreaCases() > b.getAreaCases()) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
    }
}
