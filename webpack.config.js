// let babelLoaderOptions = {
//   babelrc: false,
//   presets: [
//     [require.resolve('babel-preset-env'), {
//       modules: false
//     }], require.resolve('babel-preset-stage-2')
//   ],
//   plugins: [require.resolve('babel-plugin-transform-runtime')],
// };

let babelLoaderOptions = {
  babelrc: false,
}

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
    }]
  }
}


