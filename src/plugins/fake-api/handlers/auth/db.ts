import type { User } from '@/plugins/fake-api/handlers/auth/types'
import avatar1 from '@images/avatars/avatar-1.png'
import { productId, productName } from '@/configs/productConfig'

interface DB {
  userTokens: string[]
  users: User[]
}
export const db: DB = {
  // TODO: Use jsonwebtoken pkg
  // ℹ️ Created from https://jwt.io/ using HS256 algorithm
  // ℹ️ We didn't created it programmatically because jsonwebtoken package have issues with esm support. View Issues: https://github.com/auth0/node-jsonwebtoken/issues/655
  userTokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.fhc3wykrAnRpcKApKhXiahxaOe8PSHatad31NuIZ0Zg',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.cat2xMrZLn0FwicdGtZNzL7ifDTAKWB0k1RurSWjdnw',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6M30.PGOfMaZA_T9W05vMj5FYXG5d47soSPJD1WuxeUfw4L4',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NH0.d_9aq2tpeA9-qpqO0X4AmW6gU2UpWkXwc04UJYFWiZE',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NX0.ocO77FbjOSU1-JQ_BilEZq2G_M8bCiB10KYqtfkv1ss',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nn0.YgQILRqZy8oefhTZgJJfiEzLmhxQT_Bd2510OvrrwB8',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6N30.KH9RmOWIYv_HONxajg7xBIJXHEUvSdcBygFtS2if8Jk',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OH0.shrp-oMHkVAkiMkv_aIvSx3k6Jk-X7TrH5UeufChz_g',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OX0.9JD1MR3ZkwHzhl4mOHH6lGG8hOVNZqDNH6UkFzjCqSE',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTB9.txWLuN4QT5PqTtgHmlOiNerIu5Do51PpYOiZutkyXYg',
  ],

  users: [
    {
      id: 1,
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'admin',

      avatar: avatar1,
      email: 'admin@demo.com',
      role: 'admin',
      abilityRules: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
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
      extras: {
        eCommerceCartItemsCount: 5,
      },
      ability: [
        {
          action: 'manage',
          subject: 'all',
        },
      ],
      defaultCurrency: 'USD',
      currencies: ['AUD', 'NZD', 'CAD', 'EUR', 'INR', 'USD', 'BRL'],
    },
    {
      id: 2,
      fullName: 'Jane Doe',
      username: 'janedoe',
      password: 'client',

      avatar: `${import.meta.env.BASE_URL ?? '/'}images/avatars/avatar-2.png`,
      email: 'client@demo.com',
      role: 'client',
      abilityRules: [
        {
          action: 'read',
          subject: 'AclDemo',
        },
      ],
    },
  ],
}
