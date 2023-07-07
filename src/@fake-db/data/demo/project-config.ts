import mock from '../../mock'
import { listImages } from '../compostela'

const projectsConfig = {
  defaultCurrency: 'USD',
  currencies: ['AUD', 'NZD', 'CAD', 'EUR', 'USD', 'INR', 'BRL'],
  image: listImages[0].publicPath,
}
mock.onPost('/api/v2/projects/config/read').reply(() => [200, { data: projectsConfig }])
