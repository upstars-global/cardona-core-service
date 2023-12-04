import './jwt'
import mock from './mock'
import './user'
import './locale'
import './demo/project-config'
import './demo'
import './compostela'

// Apps
import './data/permissions'

// Dashboard

// forwards the matched request over network
mock.onAny().passThrough()
