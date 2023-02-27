import mock from './mock'

// JWT
import './jwt'

// Apps
// import './data/user'
// import './data/group'
// import './data/players'

// Other
import './data/other/countries'

// Pages
import './data/pages/profile-data'

mock.onAny().passThrough() // forwards the matched request over network
