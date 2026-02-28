// Web stub for @stripe/stripe-react-native.
// The package calls NativeStripeSdk.getConstants() at module load time,
// which fails on web. Export no-op equivalents so the bundle compiles.
const React = require('react');

const Noop = () => null;
const noop = async () => ({});

exports.StripeProvider = ({ children }) => children;
exports.initPaymentSheet = noop;
exports.presentPaymentSheet = noop;
exports.confirmPaymentSheetPayment = noop;
exports.createPaymentMethod = noop;
exports.confirmPayment = noop;
exports.confirmSetupIntent = noop;
exports.retrievePaymentIntent = noop;
exports.retrieveSetupIntent = noop;
exports.handleURLCallback = noop;
exports.useStripe = () => ({
  initPaymentSheet: noop,
  presentPaymentSheet: noop,
  confirmPayment: noop,
  createPaymentMethod: noop,
  handleURLCallback: noop,
});
exports.useConfirmPayment = () => ({ confirmPayment: noop, loading: false });
exports.Constants = {};
