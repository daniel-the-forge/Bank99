module.exports = {
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
    /* Minify only for production build (css:build:prod); dev stays readable */
    cssnano: process.env.NODE_ENV === 'production' ? {} : false
  }
};
