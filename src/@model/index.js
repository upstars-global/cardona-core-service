import { SortDirection } from '../components/templates/BaseList/model';
export class ListSort {
    field;
    dir;
    constructor({ sortBy, sortDesc }) {
        this.field = sortBy;
        this.dir = sortDesc ? SortDirection.asc : SortDirection.desc;
    }
}
export class ListData {
    total;
    perPage;
    pageNumber;
    list;
    constructor({ data, pagination }, TCreator) {
        this.total = pagination?.total;
        this.perPage = pagination?.perPage;
        this.pageNumber = pagination?.pageNumber;
        this.list = data.map((item) => (TCreator ? new TCreator(item) : item));
    }
}
//# sourceMappingURL=index.js.map