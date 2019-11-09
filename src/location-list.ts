import {LocationInterface} from "./location-interface";

export class LocationList {
    private readonly locations: Set<LocationInterface> = new Set<LocationInterface>();

    public addLocation(location: LocationInterface) {
        this.locations.add(location);
    }

    public getList(): LocationInterface[] {
        return Array.from(this.locations);
    }

    public getByPriority(): LocationInterface[] {
        return this.getList()
            .sort((a: LocationInterface, b: LocationInterface) => {
                if (a.getNumberOfCases() > b.getNumberOfCases()) {
                    return -1;
                }
                if (a.getNumberOfCases() < b.getNumberOfCases()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
    }
}
