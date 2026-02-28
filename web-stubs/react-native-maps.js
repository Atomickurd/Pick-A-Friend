// Web stub for react-native-maps.
// The package calls UIManager.getViewManagerConfig() at module load time,
// which doesn't exist on web. Return no-op React components so the bundle
// compiles and the map screen simply shows nothing on web.
const React = require('react');

const Noop = () => null;

const MapView = Noop;
MapView.Animated = Noop;

exports.default = MapView;
exports.MapView = MapView;
exports.Marker = Noop;
exports.Callout = Noop;
exports.CalloutSubview = Noop;
exports.Circle = Noop;
exports.Polygon = Noop;
exports.Polyline = Noop;
exports.Overlay = Noop;
exports.Heatmap = Noop;
exports.PROVIDER_GOOGLE = 'google';
exports.PROVIDER_DEFAULT = null;
module.exports = exports;
