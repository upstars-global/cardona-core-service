import { ListSort } from '../../../../@model'
import type { SortItem } from '../../../../@core/types'

export const mapSortData = (sortData: SortItem[]) => {
  return sortData.isEmpty
    ? null
    : sortData.map(item => {
      if (item.key)
        return new ListSort({ sortBy: item.key, sortDesc: item.order })

      return null
    })
}
