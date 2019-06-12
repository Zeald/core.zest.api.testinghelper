const { notDefined } = require('./helpers/functions');
const { ZestApi } = require('./helpers/ZestApi');

// Zest 4 Pages
const Zest4CategoryPage = require('./pages/zest4/CategoryPage').CategoryPage;
const Zest4CheckoutPage = require('./pages/zest4/CheckoutPage').CheckoutPage;
const Zest4ContactUs = require('./pages/zest4/ContactUs').ContactUs;
const Zest4EnquiryReceiptPage = require('./pages/zest4/EnquiryReceiptPage').EnquiryReceiptPage;
const Zest4HomePage = require('./pages/zest4/HomePage').HomePage;
const Zest4Page = require('./pages/zest4/Page').Page;
const Zest4ProductPage = require('./pages/zest4/ProductPage').ProductPage;
const Zest4ReceiptPage = require('./pages/zest4/ReceiptPage').ReceiptPage;

// export helper modules
module.exports.notDefined = notDefined;
module.exports.ZestApi = ZestApi;
// export zest4 pages class
module.exports.Zest4CategoryPage = Zest4CategoryPage;
module.exports.Zest4CheckoutPage = Zest4CheckoutPage;
module.exports.Zest4ContactUs = Zest4ContactUs;
module.exports.Zest4EnquiryReceiptPage = Zest4EnquiryReceiptPage;
module.exports.Zest4HomePage = Zest4HomePage;
module.exports.Zest4ProductPage = Zest4ProductPage;
module.exports.Zest4ReceiptPage = Zest4ReceiptPage;
module.exports.Zest4Page = Zest4Page;
