module.exports = {
  // entry: './testClass.mjs',
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react', '@babel/env'],
            plugins: [
              ['@babel/transform-react-jsx', {
                pragma: 'Maki.createElement'
              }],
              '@babel/proposal-object-rest-spread'
            ]
          }
        }
      }
    ]
  }
};
