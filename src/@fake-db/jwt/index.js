import mock from '../../@fake-db/mock'
import jwt from 'jsonwebtoken'
import { productId, productName } from '@productConfig'

export const usersList = [
  {
    id: 1,
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'admin',
    // eslint-disable-next-line global-require
    avatar: require('../../assets/images/avatars/13-small.png'),
    email: 'admin@demo.com',
    role: 'admin',
    permissions: [
      {
        target: 'demo-demo',
        access: 4,
      },
      {
        target: 'demo-demo-report',
        access: 1,
      },
      {
        target: 'demo-demo-seo',
        access: 3,
      },
    ],
    products: [
      {
        name: productName,
        id: productId,
      },
    ],
    projects: [
      {
        id: 164,
        name: 'ThorDevelop',
        publicName: 'ThorDevelop',
        alias: 'thor_develop',
        websiteUrl: 'https://rc.thor-develop.upstr.to',
        integrations: { valencia: true, marbella: true },
        iconPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
        originProject: {
          integrations: { valencia: true, marbella: true },
          websiteUrl: 'https://rc.thor-develop.upstr.to',
          publicName: 'ThorDevelop',
          locales: [
            'en',
            'en_AU',
            'en_CA',
            'en_IN',
            'en_NZ',
            'es',
            'fr',
            'fr_CA',
            'fr_FR',
            'pt',
            'pt_BR',
          ],
          mainLocale: 'en',
          icon: {
            path: null,
            compostelaPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
            publicPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
          },
          id: 164,
          name: 'ThorDevelop',
          alias: 'thor_develop',
          iconPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
        },
        mainLocale: 'en',
        locales: [
          'en',
          'en_AU',
          'en_CA',
          'en_IN',
          'en_NZ',
          'es',
          'fr',
          'fr_CA',
          'fr_FR',
          'pt',
          'pt_BR',
        ],
      },
    ],
    ability: [
      {
        action: 'manage',
        subject: 'all',
      },
    ],
    extras: {
      eCommerceCartItemsCount: 5,
    },
    defaultCurrency: 'USD',
    currencies: ['AUD', 'NZD', 'CAD', 'EUR', 'INR', 'USD', 'BRL'],
  },
  {
    id: 2,
    fullName: 'Jane Doe',
    username: 'janedoe',
    password: 'client',
    // eslint-disable-next-line global-require
    avatar: require('../../assets/images/avatars/1-small.png'),
    email: 'client@demo.com',
    role: 'client',
    permissions: [
      {
        target: 'demo-demo',
        access: 4,
      },
      {
        target: 'demo-demo-report',
        access: 1,
      },
      {
        target: 'demo-demo-seo',
        access: 3,
      },
    ],
    products: [],
    projects: [
      {
        id: 164,
        name: 'ThorDevelop - 2',
        publicName: 'ThorDevelop - 2',
        alias: 'thor_develop',
        websiteUrl: 'https://rc.thor-develop.upstr.to',
        integrations: { valencia: true, marbella: true },
        iconPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
        originProject: {
          integrations: { valencia: true, marbella: true },
          websiteUrl: 'https://rc.thor-develop.upstr.to',
          publicName: 'ThorDevelop - 2',
          locales: [
            'en',
            'en_AU',
            'en_CA',
            'en_IN',
            'en_NZ',
            'es',
            'fr',
            'fr_CA',
            'fr_FR',
            'pt',
            'pt_BR',
          ],
          mainLocale: 'en',
          icon: {
            path: null,
            compostelaPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
            publicPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
          },
          id: 164,
          name: 'ThorDevelop - 2',
          alias: 'thor_develop-2',
          iconPath: '/svc/img/i/shared/projects/chromevnztIDiq_png',
        },
        mainLocale: 'en',
        locales: [
          'en',
          'en_AU',
          'en_CA',
          'en_IN',
          'en_NZ',
          'es',
          'fr',
          'fr_CA',
          'fr_FR',
          'pt',
          'pt_BR',
        ],
      },
    ],
    ability: [
      {
        action: 'read',
        subject: 'ACL',
      },
      {
        action: 'read',
        subject: 'Auth',
      },
    ],
    extras: {
      eCommerceCartItemsCount: 5,
    },
  },
]

// ! These two secrets shall be in .env file and not in any other file
const jwtConfig = {
  secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
  refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
  expireTime: '10m',
  refreshTokenExpireTime: '10m',
}

mock.onPost('/jwt/login').reply(async (request) => {
  const { email, password } = JSON.parse(request.data)

  let error = {
    email: ['Something went wrong'],
  }

  const user = usersList.find((u) => u.email === email && u.password === password)

  if (user) {
    try {
      const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expireTime,
      })
      const refreshToken = jwt.sign({ id: user.id }, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshTokenExpireTime,
      })

      const userData = { ...user }

      delete userData.password

      const response = {
        userData,
        accessToken,
        refreshToken,
      }

      return [200, response]
    } catch (e) {
      error = e
    }
  } else {
    error = {
      email: ['Email or Password is Invalid'],
    }
  }

  return [400, { error }]
})

mock.onPost('/jwt/register').reply((request) => {
  const { username, email, password } = JSON.parse(request.data)

  // If not any of data is missing return 400
  if (!(username && email && password)) return [400]

  const isEmailAlreadyInUse = usersList.find((user) => user.email === email)
  const isUsernameAlreadyInUse = usersList.find((user) => user.username === username)

  const error = {
    password: !password ? ['Please enter password'] : null,
    email: (() => {
      if (!email) return ['Please enter your email.']
      if (isEmailAlreadyInUse) return ['This email is already in use.']
      return null
    })(),
    username: (() => {
      if (!username) return ['Please enter your username.']
      if (isUsernameAlreadyInUse) return ['This username is already in use.']
      return null
    })(),
  }

  if (!error.username && !error.email) {
    const userData = {
      email,
      password,
      username,
      fullName: '',
      avatar: null,
      role: 'admin',
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
    }

    // Add user id
    const { length } = usersList
    let lastIndex = 0
    if (length) {
      lastIndex = usersList[length - 1].id
    }
    userData.id = lastIndex + 1

    usersList.push(userData)

    const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expireTime,
    })

    const user = { ...userData }
    delete user.password
    const response = {
      userData: user,
      accessToken,
    }

    return [200, response]
  }
  return [400, { error }]
})

mock.onPost('/jwt/refresh-token').reply((request) => {
  const { refreshToken } = JSON.parse(request.data)

  try {
    const { id } = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret)

    const userData = { ...usersList.find((user) => user.id === id) }

    const newAccessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    })
    const newRefreshToken = jwt.sign({ id: userData.id }, jwtConfig.refreshTokenSecret, {
      expiresIn: jwtConfig.refreshTokenExpireTime,
    })

    delete userData.password
    const response = {
      userData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }

    return [200, response]
  } catch (e) {
    const error = 'Invalid refresh token'
    return [401, { error }]
  }
})