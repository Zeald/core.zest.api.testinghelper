const { DriverFactory } = require('../helpers/DriverFactory');
const { HomePage } = require('../pages/zest4/HomePage');
const { CategoryPage } = require('../pages/zest4/CategoryPage');
const { FavouritesPage } = require('../pages/zest4/FavouritesPage');
const dotenv = require('dotenv');
dotenv.config();

const driver = DriverFactory.build({
	type: 'chrome',
	screen: {
		width: 1024,
		height: 768
	}
});

const homePage = new HomePage(
	driver,
	process.env.TEST_BASE_URL
);

describe('Test', () => {
	it('Favourites', async () => {
		// go back home
		await homePage.open();
		await homePage.closeModalIfExist();

		// get a category url
		const categoryURL = await homePage.getCategoryURL(1);

		// create and open a category page
		const categoryPage = await new CategoryPage(driver, categoryURL);
		await categoryPage.open();
		await categoryPage.closeModalIfExist();

		// check if there are products
		await categoryPage.checkIfProductsExists();
		const expectedFilteredTitles = [
			'MoeMoe 100% Wool Summer Weight Duvet Inner 300gsm',
			'MoeMoe 100% Wool Duvet Inner 500gsm',
			'MoeMoe 100% NZ Wool Underlay 500gsm'
		];

		await categoryPage.applyFilter(null, 1, 1, expectedFilteredTitles);
		const additionalTitles = [
			'Baksana Linen Sheet Sets',
			'Baksana Luxury 1000 Thread Count Sateen Sheets / Pillowcases Sold Separately',
			'Bianca Lorenne - Ajour Sheets - Ivory / Pillowcases sold separately',
			'Bianca Lorenne - Ajour Sheets - White / Pillowcases sold separately',
			'Bianca Lorenne - Banbu Sheet Set / Extra Pillowcases Sold Separately',
			'Bianca Lorenne Livorno White-Taupe Sheets / Pillowcases Sold Separately',
			'Bianca Lorenne Livorno White-White Sheets/Pillowcases Sold Separately',
			'Bianca Lorenne Tichette Sheet Set',
			'MM Linen - Blake Sheet Set - White',
			'MM Linen Cove Natural Sheet Set / Extra Euros and Pillowcases Sold Separately',
			'MM Linen Croft 300TC Silver Grey Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen Croft 300TC White Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen Croft 300TC Ivory Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen - Laundered Linen Blush Sheet Set',
			'MM Linen Laundered Linen Charcoal Sheet Set',
			'MM Linen Laundered Linen Duckegg Sheet Set',
			'MM Linen Laundered Linen Natural Sheet Set',
			'MM Linen Maddon 500TC White Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen - French Bee Sheet Set/Eurocases Sold Separately - Duckegg',
			'Bianca Lorenne - Ajour Pillowcases and Eurocases - White',
			'Bianca Lorenne Amarento Pillowcase and Eurocase - Duck Egg',
			'Bianca Lorenne - Amarento  Pillowcase and Eurocase - Ivory',
			'Bianca Lorenne - Amarento Pillowcase and Eurocase - Natural Linen',
			'Bianca Lorenne - Amarento Pillowcase and Eurocase - White'
		];

		await categoryPage.goToNextPage(null, additionalTitles, true);

		const expectedTitles = [
			'Baksana Linen Sheet Sets',
			'Baksana Luxury 1000 Thread Count Sateen Sheets / Pillowcases Sold Separately',
			'Bianca Lorenne - Ajour Sheets - Ivory / Pillowcases sold separately',
			'Bianca Lorenne - Ajour Sheets - White / Pillowcases sold separately',
			'Bianca Lorenne - Banbu Sheet Set / Extra Pillowcases Sold Separately',
			'Bianca Lorenne Livorno White-Taupe Sheets / Pillowcases Sold Separately',
			'Bianca Lorenne Livorno White-White Sheets/Pillowcases Sold Separately',
			'Bianca Lorenne Tichette Sheet Set',
			'MM Linen - Blake Sheet Set - White',
			'MM Linen Cove Natural Sheet Set / Extra Euros and Pillowcases Sold Separately',
			'MM Linen Croft 300TC Silver Grey Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen Croft 300TC White Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen Croft 300TC Ivory Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen - Laundered Linen Blush Sheet Set',
			'MM Linen Laundered Linen Charcoal Sheet Set',
			'MM Linen Laundered Linen Duckegg Sheet Set',
			'MM Linen Laundered Linen Natural Sheet Set',
			'MM Linen Maddon 500TC White Sheet Set / Extra Pillowcases Sold Separately',
			'MM Linen - French Bee Sheet Set/Eurocases Sold Separately - Duckegg',
			'Bianca Lorenne - Ajour Pillowcases and Eurocases - White',
			'Bianca Lorenne Amarento Pillowcase and Eurocase - Duck Egg',
			'Bianca Lorenne - Amarento  Pillowcase and Eurocase - Ivory',
			'Bianca Lorenne - Amarento Pillowcase and Eurocase - Natural Linen',
			'Bianca Lorenne - Amarento Pillowcase and Eurocase - White'
		];

		await categoryPage.jumpPage(null, null, expectedTitles, true);

		const expectedSortedTitles = [
			'100% Cotton Knitted Baby Blanket',
			'Baksana - 80/20 Summer Hungarian Goose Down Feather Duvet Inner',
			'Baksana - 95/5 Summer White Hungarian Goose Down Feather Duvet Inner',
			'Baksana - Basketweave Duvet Cover Set',
			'Baksana - Bloom Duvet Cover Set',
			'Baksana - Calm Waters Bedspread Set - Duck Egg',
			'Baksana - Calm Waters Bedspread Set - White',
			'Baksana - Camille Duvet Cover Set',
			'Baksana - Country Garden King Duvet Cover Set - ON SALE',
			'Baksana - Divine Cotton Throws',
			'Baksana - Flora Duvet Cover Set',
			'Baksana - Florence Duvet Cover Set',
			'Baksana - Lilac Duvet Cover Set - King - ON SALE',
			'Baksana - Linen Duvet Cover Set',
			'Baksana - Lucky Clover King Duvet Cover Set - ON SALE',
			'Baksana - Mauve Eden Duvet Cover set',
			'Baksana - Morrisey King Duvet Cover Set - ON SALE',
			'Baksana - New Bliss Stonewashed Blankets',
			'Baksana - New Bliss Stonewashed Blankets',
			'Baksana - New Bliss Stonewashed Blankets',
			'Baksana - New Bliss Stonewashed Blankets',
			'Baksana - New Bliss Stonewashed Blankets',
			'Baksana - Palace Duvet Cover Set',
			'Baksana - Prairie Cotton Throws'
		];

		await categoryPage.productSort(1, null, expectedSortedTitles, true);

		await categoryPage.addProductToCart(1, true);
		await categoryPage.addProductToFavourites();
	});

	after(async () => {
		await driver.quit();
	});
});
