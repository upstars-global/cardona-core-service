export class GamesFilters {
    search;
    type;
    categoryNames;
    producerNames;
    isActive;
    runner;
    isGameByBonuses;
    isGameAvailableByBonuses;
    updatedFrom;
    updatedTo;
    tagNames;
    constructor({ search, type, categoryNames, producerNames, isActive, runner, isGameByBonuses, isGameAvailableByBonuses, updatedFrom, updatedTo, tagNames, }) {
        this.search = search;
        this.type = type;
        this.categoryNames = categoryNames;
        this.producerNames = producerNames;
        this.isActive = isActive;
        this.runner = runner;
        this.isGameByBonuses = isGameByBonuses;
        this.isGameAvailableByBonuses = isGameAvailableByBonuses;
        this.updatedFrom = updatedFrom;
        this.updatedTo = updatedTo;
        this.tagNames = tagNames;
    }
}
//# sourceMappingURL=games.js.map