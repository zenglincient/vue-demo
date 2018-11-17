const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// let babelLoaderOptions = {
//   babelrc: false,
//   presets: [
//     [require.resolve('babel-preset-env'), {
//       modules: false
//     }], require.resolve('babel-preset-stage-2')
//   ],
//   plugins: [require.resolve('babel-plugin-transform-runtime')],
// };

const config = {
  paths: {
    src: './src/',
    assetsURLCSS: '../asset/',
    deployTag: 'EDVVB',
    assetHost: 'static-src.vip.cn',
    staticFilesHost: 'static-files.vip.cn',
  },
  isProduction: process.env.NODE_ENV === 'production',
  buildConfig: {
    outputNamingPattern: 'hash'
  }
}

let babelLoaderOptions = {
  babelrc: false,
}

let scssLoaderOptions = {
  fallback: 'style-loader', // 备选项
  use: [{
    loader: 'css-loader',
    options: {
      url: false,
      sourceMap: true
    }
  }, {
    loader: 'postcss-loader',
    options: {
      config: {
        plugins: [
          require('postcss-smart-import')({}),
          require('precss')({}),
          require('autoprefixer')({
            browsers: ['> 1%', 'last 5 versions', 'Firefox >= 20', 'iOS >= 7',
              /** @see https://github.com/postcss/autoprefixer/issues/776 */
              'safari >= 6'
            ]
          })
        ]
      }
    }
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      data: '$ASSETS_URL: "' +
        config.paths.assetsURLCSS +
        '"; $STATIC_FILES_HOST: "' +
        config.paths.staticFilesHost +
        '"; $DEPLOY_TAG: "' +
        config.deployTag +
        '";',
    }
  }]
}

let vueScssLoaderOptions = Object.assign({}, scssLoaderOptions);
  vueScssLoaderOptions.fallback = 'vue-style-loader';

let basePlugins = [
  // 暂时不使用 ModuleConcatenationPlugin 作用域提升插件, 因为会对 webpack dev 模式造成影响
  // new webpack.optimize.ModuleConcatenationPlugin(),
  new ExtractTextPlugin({
    filename: config.buildConfig.outputNamingPattern === 'hash' ? '[name]-[contenthash:8].css' : '[name].css',
    allChunks: true,
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.DefinePlugin({
    'process.env': {
      STATIC_FILES_HOST: '"' + config.paths.staticFilesHost + '"',
      ASSETS_HOST: '"' + config.paths.assetsHost + '"',
      ASSETS_RELATIVE_PATH: '"' + config.paths.assetsRelativePath + '"',
      ASSETS_URL: '"' + config.paths.assetsURLJS + '"',
      DEPLOY_TAG: '"' + config.deployTag + '"',
      NODE_ENV: config.isProduction ? '"production"' : '"development"',
    },
  }),
];



const excludeRegexStr = `node_modules(?!(\/|\\\\))`;
const excludeRegex = new RegExp(excludeRegexStr);

module.exports = {
  // 入口
  entry: {
    app: './src/js/app.js',
    vendor: './src/vendor/vendor.js'
  },

  // 输出
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },

  // 配置热更新
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },

  // 模块loader
  module: {
    rules: [{
      test: /\.js$/, // 输入文件正则
      use: {
        loader: 'babel-loader', // 使用什么loader
        options: babelLoaderOptions // 选项
      },
      exclude: excludeRegex // 排除的文件
    }, {
      test: /\.vue$/,
      use: {
        loader: 'vue-loader', // 使用 vue loader
        options: {
          loader: {
            scss: ExtractTextPlugin.extract(vueScssLoaderOptions),
            js: {
              loader: 'babel-loader',
              options: babelLoaderOptions,
            },
          }
        }
      }
    }, {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader', // 备选项
        use: [{
          loader: 'css-loader',
          options: {
            url: false,
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: path.join(__dirname, 'postcss.config.js'),
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: '$ASSETS_URL: "' +
              config.paths.assetsURLCSS +
              '"; $STATIC_FILES_HOST: "' +
              config.paths.staticFilesHost +
              '"; $DEPLOY_TAG: "' +
              config.deployTag +
              '";',
          }
        }]
      })
    }, {
      test: /\.art$/,
      use: [{
        loader: 'art-template-loader',
      }]
    }]
  },

  // 配置解析目录
  resolve: {
    extensions: ['.js', '.vue'], // 这些是解析的路径名称，按照顺序优先来
    modules: [__dirname, path.join('node_modules')],  // 简化模块的查找，这个文件夹下的不会被查找
    alias: {
      js: path.join(config.paths.src, 'js'),
      scss: path.join(config.paths.src, 'scss'),
      tpl: path.join(config.paths.src, 'tpl'),
      common: path.join(config.paths.src, 'js/common'),
      component: path.join(config.paths.src, 'js/component'),
      'v-component': path.join(config.paths.src, 'js/v-component'),
      'v-components': path.join(config.paths.src, 'js/v-components'), // 暂时兼容旧版项目
      'v-directive': path.join(config.paths.src, 'js/v-directive'),
      'v-filter': path.join(config.paths.src, 'js/v-filter'),
      'v-mixin': path.join(config.paths.src, 'js/v-mixin'),
      'v-plugin': path.join(config.paths.src, 'js/v-plugin'),
      'v-store': path.join(config.paths.src, 'js/v-store'),
    }

  },
  plugins: basePlugins,
}


