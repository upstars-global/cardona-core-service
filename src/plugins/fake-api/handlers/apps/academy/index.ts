import destr from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/academy/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsAcademy = [

  // 👉 Course
  rest.get(('/api/apps/academy/courses'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const label = req.url.searchParams.get('label') || 'All Courses'
    const hideCompleted = req.url.searchParams.get('hideCompleted')
    const page = req.url.searchParams.get('page')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')

    const searchQuery = typeof q === 'string' ? q : undefined
    const queryLowered = (searchQuery ?? '').toString().toLowerCase()

    const parsedHideCompleted = destr(hideCompleted)
    const hideCompletedLocal = typeof parsedHideCompleted === 'boolean' ? parsedHideCompleted : false

    const parsedSortBy = destr(sortBy)
    const sortByLocal = typeof parsedSortBy === 'string' ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = typeof parsedOrderBy === 'string' ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = typeof parsedItemsPerPage === 'number' ? parsedItemsPerPage : 10
    const pageLocal = typeof parsedPage === 'number' ? parsedPage : 1

    const filteredCourses = db.courses.filter(course => {
      return (
        (
          course.courseTitle.toLowerCase().includes(queryLowered)
                || course.user.toLowerCase().includes(queryLowered)
        )
            && !((course.completedTasks === course.totalTasks) && hideCompletedLocal)
            && (label !== 'All Courses' ? course.tags.toLocaleLowerCase() === label?.toLowerCase() : true)
      )
    })

    if (sortByLocal) {
      if (sortByLocal === 'courseName') {
        filteredCourses.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.courseTitle.localeCompare(b.courseTitle)
          else
            return b.courseTitle.localeCompare(a.courseTitle)
        })
      }
      if (sortByLocal === 'progress') {
        filteredCourses.sort((a, b) => {
          if (orderByLocal === 'asc')
            return (a.completedTasks / a.totalTasks) - (b.completedTasks / b.totalTasks)
          else
            return (b.completedTasks / b.totalTasks) - (a.completedTasks / a.totalTasks)
        })
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        courses: paginateArray(filteredCourses, itemsPerPageLocal, pageLocal),
        total: filteredCourses.length,
      }),
    )
  }),

  // 👉 Course Details
  rest.get(('/api/apps/academy/course-details'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        db.courseDetails,
      ),
    )
  }),
]
