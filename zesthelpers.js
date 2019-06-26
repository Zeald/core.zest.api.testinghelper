const { notDefined, isEqual, pickRandom } = require('./helpers/functions');
const { ZestApi } = require('./helpers/ZestApi');
const { DriverFactory } = require('./helpers/DriverFactory');

// Zest 4 Pages
const Zest4SuperCategoryPage = require('./pages/zest4/SuperCategoryPage').SuperCategoryPage;
const Zest4CategoryPage = require('./pages/zest4/CategoryPage').CategoryPage;
const Zest4CheckoutPage = require('./pages/zest4/CheckoutPage').CheckoutPage;
const Zest4ContactUs = require('./pages/zest4/ContactUs').ContactUs;
const Zest4EnquiryReceiptPage = require('./pages/zest4/EnquiryReceiptPage').EnquiryReceiptPage;
const Zest4HomePage = require('./pages/zest4/HomePage').HomePage;
const Zest4Page = require('./pages/zest4/Page').Page;
const Zest4ProductPage = require('./pages/zest4/ProductPage').ProductPage;
const Zest4ReceiptPage = require('./pages/zest4/ReceiptPage').ReceiptPage;
const Zest4FavouritesPage = require('./pages/zest4/FavouritesPage').FavouritesPage;

// Zest 3 Pages
const Zest3CategoryPage = require('./pages/zest3/CategoryPage').CategoryPage;
const Zest3CheckoutPage = require('./pages/zest3/CheckoutPage').CheckoutPage;
const Zest3ContactUs = require('./pages/zest3/ContactUs').ContactUs;
const Zest3EnquiryReceiptPage = require('./pages/zest3/EnquiryReceiptPage').EnquiryReceiptPage;
const Zest3HomePage = require('./pages/zest3/HomePage').HomePage;
const Zest3Page = require('./pages/zest3/Page').Page;
const Zest3ProductPage = require('./pages/zest3/ProductPage').ProductPage;
const Zest3ReceiptPage = require('./pages/zest3/ReceiptPage').ReceiptPage;

// export helper modules
module.exports.notDefined = notDefined;
module.exports.isEqual = isEqual;
module.exports.pickRandom = pickRandom;
module.exports.utils = {
	notDefined,
	isEqual,
	pickRandom
};
module.exports.ZestApi = ZestApi;
module.exports.DriverFactory = DriverFactory;

// export zest4 pages class
module.exports.Zest4SuperCategoryPage = Zest4SuperCategoryPage;
module.exports.Zest4CategoryPage = Zest4CategoryPage;
module.exports.Zest4CheckoutPage = Zest4CheckoutPage;
module.exports.Zest4ContactUs = Zest4ContactUs;
module.exports.Zest4EnquiryReceiptPage = Zest4EnquiryReceiptPage;
module.exports.Zest4HomePage = Zest4HomePage;
module.exports.Zest4ProductPage = Zest4ProductPage;
module.exports.Zest4ReceiptPage = Zest4ReceiptPage;
module.exports.Zest4Page = Zest4Page;
module.exports.Zest4FavouritesPage = Zest4FavouritesPage;

// export zest3 pages class
module.exports.Zest3CategoryPage = Zest3CategoryPage;
module.exports.Zest3CheckoutPage = Zest3CheckoutPage;
module.exports.Zest3ContactUs = Zest3ContactUs;
module.exports.Zest3EnquiryReceiptPage = Zest3EnquiryReceiptPage;
module.exports.Zest3HomePage = Zest3HomePage;
module.exports.Zest3ProductPage = Zest3ProductPage;
module.exports.Zest3ReceiptPage = Zest3ReceiptPage;
module.exports.Zest3Page = Zest3Page;

