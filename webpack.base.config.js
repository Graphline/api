if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production') {
  throw new Error([
    'NODE_ENV must be either "development" or "production",',
    `got ${JSON.stringify(process.env.NODE_ENV)}`,
  ].join(' '))
}

const isDev = process.env.NODE_ENV === 'development'
const {
  DefinePlugin,
  BannerPlugin,
  NoEmitOnErrorsPlugin,
} = require('webpack')

const path = require('path')
const git = require('git-revision')

const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')

const config = {
  'target':    'node',
  'name':      'base',
  'mode':      process.env.NODE_ENV,
  'externals': nodeExternals({
    'whitelist': [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  'performance': {
    'hints': false,
  },
  'resolve': {
    'extensions': ['.js', '.json',],
    'alias':      {
      '@':      path.resolve(__dirname),
      '~':      path.resolve(__dirname, 'src'),
      'lib':    path.resolve(__dirname, 'lib'),
      'api':    path.resolve(__dirname, 'api'),
      'client': path.resolve(__dirname, 'client'),
    },
  },
  'node': {
    '__filename': true,
    '__dirname':  true,
  },
  'output': {
    'path':              path.resolve('./build'),
    'filename':          '[name].js',
    'sourceMapFilename': '[name].map',
    'publicPath':        '/',
    'libraryTarget':     'commonjs2',
  },
  'plugins': [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__':              process.env.NODE_ENV === 'development',
      'MIRROR.version':       {
        'revisionTag':    JSON.stringify(git('tag')),
        'revisionLong':   JSON.stringify(git('long')),
        'revisionShort':  JSON.stringify(git('short')),
        'revisionBranch': JSON.stringify(git('branch')),
      },
    }),
    new BannerPlugin({
      'raw':       true,
      'entryOnly': false,
      'banner':    [
        "require('source-map-support/register');",
      ].join(''),
    }),
    new FriendlyErrorsWebpackPlugin({
      'clearConsole': process.env.NODE_ENV === 'development',
    }),
    new NoEmitOnErrorsPlugin(),
  ],
  'module': {
    'rules': [
      {
        'test':   /\.graphql$/,
        'loader': require.resolve('graphql-import-loader'),
      },
      {
        'test':    /\.js$/,
        'loader':  require.resolve('webpack-import-glob'),
        'enforce': 'pre',
        'exclude': [
          /node_modules/,
          path.resolve('./build'),
        ],
      },
      {
        'test':    /\.(js)$/,
        'loader':  require.resolve('babel-loader'),
        'exclude': [
          /node_modules/,
          path.resolve('./build'),
        ],
        'options': {
          'babelrc':        true,
          'cacheDirectory': true,
          'presets':        [
            [
              'env',
              {
                'targets': {
                  'node': 'current',
                },
              },
            ],
          ],
          'plugins': [
            '@babel/plugin-proposal-object-rest-spread',
          ],
        },
      },
    ],
  },
}

if (isDev) {
  config.plugins.push(new NodemonPlugin({
    'quiet':  true,
    'ignore': [
      '*.js.map',
      './node_modules/**/*',
    ],
  }),)
}

module.exports = config
