var express       = require('express');
path              = require('path');
var favicon       = require('static-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var multer        = require('multer'); // Used to aid in file uploads in forms

//Global Variables
// Master header file for scube app
DEFS          = require('scube-cms/defines/defines.js'); 

passport      = require('passport'); // Authentication
dbConfig      = require(DEFS.DIR.DB_CONFIG);
socialConfig  = require(DEFS.DIR.SOCIAL_CONFIG); // Load the social config
SCUBE_LOG     = require(DEFS.DIR.LOGGER); //Global logger object
SCUBE_LOG     = new SCUBE_LOG();
jsonUtil      = require(DEFS.DIR.JSON_UTIL);  // Global Json Library Utility
jsonUtil      = new jsonUtil();
jsonBuilder   = require(DEFS.DIR.JSON_BUILDER);  // Global Json Library Utility
jBuilder      = new jsonBuilder();
cloudinary    = require('cloudinary'); // Global Handle for image server
dbConnectMongo = null; // Global handle for mongo db
imageLibrary  = require(DEFS.DIR.IMAGE_LIB); // Global handle for image library util
imageLib      = new imageLibrary(); // Global handle for image library util
// App config for image server 
cloudinary.config({ 
  cloud_name: 'dxewibnvd', 
  api_key: '683251153875664', 
  api_secret: 'M0yIqj6_Lt0wKOfhGQ2ehyj-pA4' 
});


/* Need to research if its a good practice to do this*/
// Global Domain handling utility
domainHandler = require(DEFS.DIR.DOMAIN_HANDLER);
domainHandler = new domainHandler();

// Global Data Parser handling utility
dataParser    = require(DEFS.DIR.DATA_PARSER);
dataParser    = new dataParser();

/* Need to research if its a good practice to do this*/
var flash     = require('connect-flash');

var session   = require('express-session'); // Passport session

var app = express();

// View engine setup
app.set('view engine', 'jade');

// Setup application
app.use(favicon());
//app.use(logger('dev'));             // log every request to the console
app.use(bodyParser.json());         // get information from html forms
app.use(bodyParser.urlencoded());
app.use(cookieParser());            // read cookies (needed for auth)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/View'));
app.use(multer({ dest: './public/temp/' }));

// Set up ejs for templating
app.set('view engine', 'ejs');

// Location to look for static assets
app.use(express.static(__dirname + '/public'));

// Set up port for application to run
app.set('port', process.env.PORT || 3001);

// Required for passport
app.use(session({ secret: 'scubersrockandtheykeeprocking'})); // session secret
app.use(passport.initialize());
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connect-flash for flash messages stored in session

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3001
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'



// This determines the app environment
DEFS.CONST.DOMAIN     = (process.env.OPENSHIFT_NODEJS_PORT) ? DEFS.CONST.PRODUCTION : DEFS.CONST.LOCALHOST;
DEFS.CONST.DOMAIN_URL = (process.env.OPENSHIFT_NODEJS_PORT) ? DEFS.CONST.PRODUCTION_URL : DEFS.CONST.LOCALHOST_URL;

// Launch Scube
var server = app.listen(server_port, server_ip_address, function () {
  console.log('Scube- CMS is scubing at IP : ' + server_ip_address + " Port : " + server_port );
});



// Routes For CMS App - Data
var cms_mall                = require(DEFS.DIR.R_CMS_MALL);
var cms_brand_profile       = require(DEFS.DIR.R_CMS_BRAND_PROFILE);
var cms_brands              = require(DEFS.DIR.R_CMS_BRANDS);
var cms_device              = require(DEFS.DIR.R_CMS_DEVICE);
var cms_device_login        = require(DEFS.DIR.R_CMS_DEVICE_LOGIN);
var cms_device_os           = require(DEFS.DIR.R_CMS_DEVICE_OS);
var cms_device_type         = require(DEFS.DIR.R_CMS_DEVICE_TYPE);
var cms_device_variant      = require(DEFS.DIR.R_CMS_DEVICE_VARIANT);
var cms_location            = require(DEFS.DIR.R_CMS_DEVICE_LOCATION);
var cms_pop_index           = require(DEFS.DIR.R_CMS_POP_INDEX);
var cms_scubit              = require(DEFS.DIR.R_CMS_SCUBIT);
var cms_scube_deals         = require(DEFS.DIR.R_CMS_SCUBE_DEALS);
var cms_shop_profile        = require(DEFS.DIR.R_CMS_SHOP_PROFILE);
var cms_combo_helpers       = require(DEFS.DIR.R_CMS_COMBO_HELPERS);
var cms_shopping_category   = require(DEFS.DIR.R_CMS_SHOPPING_CATEGORY);
var cms_shopping_offer      = require(DEFS.DIR.R_CMS_SHOPPING_OFFER);
var cms_shop                = require(DEFS.DIR.R_CMS_SHOP);
var cms_user_brand_pref     = require(DEFS.DIR.R_CMS_USER_BRAND_PREF);
var cms_user_cat_pref       = require(DEFS.DIR.R_CMS_USER_CAT_PREF);
var cms_user_login          = require(DEFS.DIR.R_CMS_USER_LOGIN);
var cms_user_profile        = require(DEFS.DIR.R_CMS_USER_PROFILE);
var cms_homepage            = require(DEFS.DIR.R_CMS_HOMEPAGE);

// Routes For CMS App - Images
var cms_images_malls            = require(DEFS.DIR.R_CMS_IMAGES_MALLS);
var cms_images_shops            = require(DEFS.DIR.R_CMS_IMAGES_SHOPS);
var cms_images_brands           = require(DEFS.DIR.R_CMS_IMAGES_BRANDS);
var cms_images_shop_profile     = require(DEFS.DIR.R_CMS_IMAGES_SHOP_PROFILE);
var cms_images_homepage         = require(DEFS.DIR.R_CMS_IMAGES_HOMEPAGE);


app.use(cms_combo_helpers);
app.use(cms_mall);
app.use(cms_brand_profile);
app.use(cms_brands);
app.use(cms_device);
app.use(cms_device_login);
app.use(cms_device_os);
app.use(cms_device_type);
app.use(cms_device_variant);
app.use(cms_location);
app.use(cms_pop_index);
app.use(cms_scubit);
app.use(cms_scube_deals);
app.use(cms_shop_profile);
app.use(cms_shopping_category);
app.use(cms_shopping_offer);
app.use(cms_shop);
app.use(cms_user_brand_pref);
app.use(cms_user_cat_pref);
app.use(cms_user_login);
app.use(cms_user_profile);
app.use(cms_homepage);

// Image CMS Routes
app.use(cms_images_malls);
app.use(cms_images_shops);
app.use(cms_images_brands);
app.use(cms_images_shop_profile);
app.use(cms_images_homepage);

// Operating system
var os = require('os');
console.log('NodeJs : Hostname : '+os.hostname()+' OS-Type : '+os.type());

module.exports = app;
