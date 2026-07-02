module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|react-redux|@reduxjs|redux|immer|reselect|react-native-deck-swiper)/)',
  ],
};
