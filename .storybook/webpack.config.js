module.exports = async ({ config }) => {
  // Add TypeScript support
  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript')
          ],
        },
      },
    ],
  });

  // Add .ts and .tsx to resolve extensions
  config.resolve.extensions.push('.ts', '.tsx');

  // Handle CSS
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  // Handle MDX files
  config.module.rules.push({
    test: /\.mdx?$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react')
          ],
        },
      },
      require.resolve('@mdx-js/loader'),
    ],
  });

  // Handle JSX files
  config.module.rules.push({
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react')
          ],
        },
      },
    ],
  });

  return config;
};