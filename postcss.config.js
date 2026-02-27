/*module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {
      url: 'copy',
      assetsPath: './fonts',
      useHash: false
    },
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {} : false
  }
}; */

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {
      url: 'inline'  // base64 encodes the font directly into the CSS
    },
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {} : false
  }
};