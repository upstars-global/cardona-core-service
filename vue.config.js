const path = require('path')
const {
  compilerOptions: { paths },
} = require('./tsconfig.json')

const proxy_headers = {
  'CF-Access-Client-Id': 'a88c3a6e984d3e87ac3639eaeb013164.access',
  'CF-Access-Client-Secret': process.env.CF_SECRET,
}

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'https://cardona-develop.upstr.to',
        headers: proxy_headers,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./node_modules', './src/assets'],
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: Object.keys(paths).reduce((acc, rawKey) => {
        const key = rawKey.replace('/*', '')
        const value = paths[rawKey][0].replace('/*', '')
        return {
          ...acc,
          [key]: path.resolve(__dirname, value),
        }
      }, {}),
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        }
        return options
      })
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
}
