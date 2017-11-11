import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import webpack from 'webpack'
import _ from 'lodash'
import * as Remove from './remove'
import * as paths from './paths'
import ManifestPlugin from './manifest/plugin'

var styleLoaders = {
  'styl': '!stylus-loader'
}

function makeStyleLoaders () {
  return Object.keys(styleLoaders).map(function (ext) {
    // NOTE Enable autoprefixer loader
    var prefix = 'css-loader?sourceMap&root=../assets'//! autoprefixer-loader?browsers=last 2 version';
    var extLoaders = prefix + styleLoaders[ext]
    var loader = 'style-loader!' + extLoaders

    return {
      loader: loader,
      test: new RegExp('\\.(' + ext + ')$'),
      exclude: /node_modules/
    }
  })
}

function configGenerator (isDevelopment, Manifest) {
  return {
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : '',
    context: __dirname,
    node: {__dirname: true},

    entry: {},

    output: (function () {
      var output

      if (isDevelopment) {
        output = {
          path: paths.build,
          filename: '[name].js',
          chunkFilename: '[name]-[chunkhash].js',
          publicPath: 'https://localhost:3001/'
        }
      } else {
        output = {
          path: paths.releaseBuild,
          filename: '[name].js'
        }
      }

      return output
    })(),

    plugins: (function () {
      let plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new ManifestPlugin(Manifest, isDevelopment),
        new webpack.DefinePlugin({
          'global.GENTLY': false,
          'process.env': {
            NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
            IS_BROWSER: true
          }
        })
      ]

      if (isDevelopment) {
        // Development plugins for hot reload
        plugins = plugins.concat([
          // NotifyPlugin,
          new webpack.HotModuleReplacementPlugin(),
          // Tell reloader to not reload if there is an error.
          new webpack.NoErrorsPlugin()
        ])
      } else {
        // Production plugins for optimizing code
        plugins = plugins.concat([
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              // Because uglify reports so many irrelevant warnings.
              warnings: false
            }
          }),
          new webpack.optimize.DedupePlugin(),
          // new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
          // new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
          function () {
            this.plugin('done', function (stats) {
              if (stats.compilation.errors && stats.compilation.errors.length) {
                console.log(stats.compilation.errors)
                process.exit(1)
              }
            })
          }
        ])
      }

      return plugins
    })(),

    externals: {
      // net: function() {}
    },

    resolve: {
      extensions: [
        '',
        '.js',
        '.jsx',
        '.json'
      ],
      modulesDirectories: [
        'src',
        'node_modules'
      ],
      root: [
        path.join(__dirname, '../src')
      ]
    },

    module: {
      loaders: (function () {
        var loaders = []

        loaders = loaders.concat([
          {
            test: /\.(png|jpg|jpeg|gif|svg)/,
            loader: 'url-loader?limit=1000000&name=[name]-[hash].[ext]',
            exclude: /node_modules/
          },
          {
            test: /\.(woff|woff2)/,
            loader: 'url-loader?limit=1000000&name=[name]-[hash].[ext]',
            exclude: /node_modules/
          },
          {
            test: /\.(ttf|eot)/,
            loader: 'url-loader?limit=1000000?name=[name]-[hash].[ext]',
            exclude: /node_modules/
          }
        ])

        // Styles
        loaders = loaders.concat(makeStyleLoaders())

        // Scripts
        loaders = loaders.concat([
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: isDevelopment ? [
              'react-hot', 'babel-loader'
            ] : [
              'babel-loader'
            ]
          }
        ])

        // Json
        loaders = loaders.concat([
          {
            test: /\.json/,
            loader: 'json-loader',
            exclude: /node_modules/
          }
        ])

        return loaders
      })()
    }
  }
}

module.exports = configGenerator
