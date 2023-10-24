import moment from 'moment'
import type { IDemoFilter } from '../../@model/demo'

export const filterDemoList = (list: Array<any>, filter: IDemoFilter) => {
  const { search, createdFrom, createdTo, tagsIds, type, gameId, isActive } = filter
  let result = list
  if (search) {
    const searchString = search?.toLowerCase()

    result = result.filter(
      item =>
        item.name.toLowerCase().includes(searchString)
        || item.id.toLowerCase().includes(searchString)
        || item.comment.toLowerCase().includes(searchString),
    )
  }
  if (!!createdFrom && !!createdTo) {
    result = result.filter(item => {
      return (
        moment(item.newDate).isSameOrAfter(createdFrom)
        && moment(item.newDate).isSameOrBefore(createdTo)
      )
    })
  }
  if (tagsIds?.isNotEmpty)
    result = result.filter(item => item.tags.some(item => tagsIds?.includes(item.id)))

  if (type)
    result = result.filter(item => item.type.id === type)

  if (gameId)
    result = result.filter(item => item.gameId.includes(gameId))

  if (isActive !== undefined)
    result = result.filter(item => item.isActive === isActive)

  return result
}
