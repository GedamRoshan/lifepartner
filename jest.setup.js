/* global jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();

  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store.get(key) ?? null)),
      setItem: jest.fn((key, value) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      removeItem: jest.fn(key => {
        store.delete(key);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve();
      }),
    },
  };
});

jest.mock('react-native-video', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View {...props} />,
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMapView = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  );
  const MockMarker = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  );
  const MockCallout = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  );

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
  };
});
