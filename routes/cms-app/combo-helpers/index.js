//COMBO HELPERS APIS
var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');

//SHOP COMBO
app.get('/cms/shop-combo/getdata', function (req, res) {
    db.query("SELECT shop_id AS id,shop_name AS description FROM tbl_shops ORDER BY shop_name ASC", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//SHOP-PROFILE COMBO
app.get('/cms/shop-profile-combo/getdata', function (req, res) {
    db.query("SELECT SHOP_PROF.shop_profile_id AS id, SHOPS.shop_name AS description FROM tbl_shop_profile AS SHOP_PROF INNER JOIN tbl_shops AS SHOPS ON(SHOPS.shop_id = SHOP_PROF.shop_id) ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//BRAND COMBO
app.get('/cms/brand-combo/getdata', function (req, res) {
    db.query("SELECT brand_id AS id,brand_name AS description FROM tbl_brands WHERE valid = 1 ORDER BY brand_name ASC", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//CATEGORY COMBO
app.get('/cms/category-combo/getdata', function (req, res) {
    db.query("SELECT category_id AS id,category_name AS description FROM tbl_shopping_category ORDER BY category_name ASC", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//DEVICE TYPE COMBO
app.get('/cms/device-type-combo/getdata', function (req, res) {
    db.query("SELECT device_type_id, description FROM tbl_device_type WHERE valid = 1 ORDER BY description ASC", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//DEVICE VARIANT COMBO
app.get('/cms/device-variant-combo/getdata', function (req, res) {
    db.query("SELECT device_variant_id AS id, description FROM tbl_device_variant WHERE valid = 1 ORDER BY description ASC", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//DEVICE OS COMBO
app.get('/cms/device-os-combo/getdata', function (req, res) {
    db.query("SELECT device_os_id AS id,description FROM tbl_device_os WHERE valid = 1 ORDER BY description ASC", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//DEVICE COMBO
app.get('/cms/device-combo/getdata', function (req, res) {
    db.query("SELECT device_id AS id, CONCAT_WS('#',device_id,imei) AS description FROM tbl_device ORDER BY id ASC", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//USER COMBO
app.get('/cms/user-combo/getdata', function (req, res) {
    db.query("SELECT user_id AS id, CONCAT_WS('#', user_id, username) AS description FROM scube_dev.tbl_user_login ORDER BY user_id", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//LOCATION COMBO
app.get('/cms/location-combo/getdata', function (req, res) {
    db.query("SELECT location_id AS id,description FROM tbl_location WHERE verified = 1 ORDER BY description ASC", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});


//GENDER COMBO
app.get('/cms/gender-combo/getdata', function (req, res) {
    db.query("SELECT gender_id AS id,description FROM tbl_gender ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//OFFER COMBO
app.get('/cms/offer-combo/getdata', function (req, res) {
    db.query("SELECT offer_id AS id, offer_name AS description FROM tbl_shopping_offers ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//PRICE RANGE COMBO
app.get('/cms/price-range-combo/getdata', function (req, res) {
    db.query("SELECT price_range_id AS id, price_range_name AS description FROM tbl_shopping_price_range ORDER BY id ASC;", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//PAYMENT TYPE COMBO
app.get('/cms/payment-type-combo/getdata', function (req, res) {
    db.query("SELECT payment_type_id AS id, payment_type_name AS description FROM tbl_shopping_payment_type ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//MALL LOCATION COMBO
app.get('/cms/mall-loc-combo/getdata', function (req, res) {
    db.query("SELECT DISTINCT(SHOP_PROFILE.mall_id) AS id,CONCAT_WS('#', LOCATION.description, SHOPPING_MALL.mall_name) AS description  FROM tbl_shop_profile SHOP_PROFILE INNER JOIN tbl_shopping_mall AS SHOPPING_MALL ON(SHOP_PROFILE.mall_id = SHOPPING_MALL.mall_id) INNER JOIN tbl_location AS LOCATION ON(LOCATION.location_id = SHOPPING_MALL.location_id) ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//SHOP PROFILE LOCATION COMBO
app.get('/cms/shop-profile-loc-combo/getdata', function (req, res) {
    db.query("SELECT SHOP_PROFILE.shop_profile_id AS id,CONCAT_WS('#', LOCATION.description, SHOPPING_MALL.mall_name, SHOP.shop_name) AS description  FROM tbl_shop_profile SHOP_PROFILE INNER JOIN tbl_shops AS SHOP ON(SHOP_PROFILE.shop_id = SHOP.shop_id) INNER JOIN tbl_shopping_mall AS SHOPPING_MALL ON(SHOP_PROFILE.mall_id = SHOPPING_MALL.mall_id) INNER JOIN tbl_location AS LOCATION ON(LOCATION.location_id = SHOPPING_MALL.location_id) ORDER BY description ASC;", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});

//MALL POPULARITY INDEX COMBO
app.get('/cms/popularity-combo/getdata', function (req, res) {
    db.query("SELECT popularity_id AS id ,description FROM tbl_popularity_index ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//USER STATUS COMBO
app.get('/cms/user-status-combo/getdata', function (req, res) {
    db.query("SELECT status_id AS id ,description FROM tbl_user_status ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

//USER TYPE COMBO
app.get('/cms/user-type-combo/getdata', function (req, res) {
    db.query("SELECT user_type_id AS id ,description FROM tbl_user_type ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});


//STATES COMBO
app.get('/cms/states-combo/getdata', function (req, res) {
    db.query("SELECT state_id AS id ,description FROM tbl_states ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});


//IMAGE TYPE COMBO
app.get('/cms/image-type-combo/getdata', function (req, res) {
    db.query("SELECT image_type_id AS id ,description FROM tbl_image_types ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});
