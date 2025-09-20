// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

// Add NativeWind
const { withNativeWind } = require('nativewind/metro');

module.exports = withNativeWind(config, { input: './app/globals.css' });
