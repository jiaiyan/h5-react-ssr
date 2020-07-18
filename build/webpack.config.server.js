const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const nodeExternals = require('webpack-node-externals')
const paths = require('./paths')
const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  new webpack.DefinePlugin({
    '__isBrowser__': false //eslint-disable-line
  })
]
module.exports = merge(baseConfig, {
  devtool: isDev ? 'eval-source-map' : '',
  entry: {
    Page: paths.entry,
    Layout: paths.layout
  },
  target: 'node',
  // 这里新增正则表达式，
  // 去匹配antd-mobile/xx/css.js这种文件，上面说了antd-mobile实质是import了一个css.js文件，
  // 而不是常规的.css文件。所以我们需要进行额外配置，来让webpack去处理该文件，
  // 将css内容抽离出单独的文件而不是和js文件打包在一起
  externals: nodeExternals({
    whitelist: [/\.(css|less|sass|scss)$/, /^antd-mobile.*?css/],
    modulesDir: paths.appNodeModules
  }),
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                [
                  'import',
                  {
                    libraryName: 'antd-mobile',
                    libraryDirectory: 'lib',
                    style: 'css'
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: '[name].server.js',
    libraryTarget: 'commonjs2'
  },
  plugins: plugins
})
