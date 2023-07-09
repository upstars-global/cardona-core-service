export class RegionInfo {
    code;
    name;
    countryName;
    label;
    constructor(code, name, countryName) {
        this.code = code;
        this.name = name;
        this.countryName = countryName;
        this.label = countryName ? `${name} (${countryName}) - ${code}` : `${name} - ${code}`;
    }
}
//# sourceMappingURL=regions.js.map