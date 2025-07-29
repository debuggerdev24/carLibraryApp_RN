const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = {
  ...getDefaultConfig(__dirname),
  assets: ['./assets/fonts'], // Ensure fonts are included
};