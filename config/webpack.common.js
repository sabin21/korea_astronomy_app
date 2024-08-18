const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');
// const TerserPlugin = require("terser-webpack-plugin");
const pages = [
  "index","draft_list",
  "draft_a","draft_b",
  "a_mo_frame","a_1_mo","b_mo_frame","b_1_mo",  
]

module.exports = {
  entry: pages.reduce((config, page) =>{
    config[page] = paths.src + `/${page}.js`;
    return config
  },
  {
    app_common:paths.src + `/app_common.js`
  }),
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  // target: ["web", "es5"],
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: '',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ].concat(pages.map(
    (page) => new HtmlWebpackPlugin({
      favicon: paths.src + '/img/favicon.png',
      template: paths.src + `/${page}.html`,
      filename: `${page}.html`,
      chunks: [page],
      inject: 'body',
      minify: false
    })
  )
  ),

  module: {
    rules: [
      {
        test : /\.js$/,
        exclude: /node_modules/,
        use : "babel-loader"
    },
      { test: /\.(?:ico|gif|png|jpg|jpeg|glb|gltf|hdr|)$/i, type: 'asset/resource',
      generator:{
        filename: './img/[hash].[ext]' 
      },    
    },
      { test: /\.(?:mp3|mp4|webm|ogg)$/i, type: 'asset/videos' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
      { test: /\.(glsl|frag|vert)$/, 
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
  //-----
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin()],
  // },
}
