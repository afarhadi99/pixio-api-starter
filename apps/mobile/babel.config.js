module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 54+) automatically configures the
    // react-native-worklets plugin used by react-native-reanimated v4.
    presets: ['babel-preset-expo'],
  };
};
