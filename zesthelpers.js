const { notDefined } = require('./helpers/functions');
const { ZestApi } = require('./helpers/ZestApi');
const { Zest4CategoryPage } = require('./pages/zest4/CategoryPage');
const { Zest4CheckoutPage } = require('./pages/zest4/CheckoutPage');
const { Zest4ContactUs } = require('./pages/zest4/ContactUs');
const { Zest4EnquiryReceiptPage } = require('./pages/zest4/EnquiryReceiptPage');
const { Zest4HomePage } = require('./pages/zest4/HomePage');
const { Zest4Page } = require('./pages/zest4/Page');
const { Zest4ProductPage } = require('./pages/zest4/ProductPage');
const { Zest4ReceiptPage } = require('./pages/zest4/ReceiptPage');

// export helper modules
module.exports.notDefined = notDefined;
module.exports.ZestApi = ZestApi;
// export zest4 pages class
module.exports = {
	Zest4CategoryPage,
	Zest4CheckoutPage,
	Zest4ContactUs,
	Zest4EnquiryReceiptPage,
	Zest4HomePage,
	Zest4ProductPage,
	Zest4ReceiptPage,
	Zest4Page
};
