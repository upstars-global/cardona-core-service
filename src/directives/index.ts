import { dayDateDirective, fullDateDirective, fullDateWithSecondsDirective } from './date'
import { currency } from './currency'

export const initDirectives = app => {
  app.directive('day-date', dayDateDirective)
  app.directive('full-date', fullDateDirective)
  app.directive('full-date-with-seconds', fullDateWithSecondsDirective)
  app.directive('currency', currency)
}
