import mock from '../../mock'

const projectsConfig = {
  defaultCurrency: 'USD',
  currencies: ['AUD', 'NZD', 'CAD', 'EUR', 'USD', 'INR', 'BRL'],
}
mock.onPost('/api/v2/projects/config/read').reply(() => [200, { data: projectsConfig }])
