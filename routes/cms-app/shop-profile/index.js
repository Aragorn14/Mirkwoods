var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/shop-profile', function (req, res) {
    res.sendfile('cms-shop-profile.html', { "root": 'views/' });
});

app.get('/cms/shop-profile/getdata', function (req, res) {
    db.query("SELECT SHOP_PROFILE.shop_profile_id AS id,shop_id,mall_id,address,phone,floor,category_id,COUNT(SCUBIT.scubit_id) AS scubit_cnt,outlet " + 
             "FROM tbl_shop_profile SHOP_PROFILE " + 
             "LEFT JOIN tbl_scubit AS SCUBIT ON (SHOP_PROFILE.shop_profile_id = SCUBIT.shop_profile_id) " +
             "GROUP BY id; ", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});


app.post('/cms/shop-profile/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var shop_id = data.shop_id;
    var mall_id = data.mall_id;
    var address = data.address;
    var floor = data.floor;
    var category_id = data.category_id;
    var outlet = data.outlet;
    var phone = data.phone;
    
    function update_response(err, result) {
        if (err) {
            console.log(err);
            mode = "error";
        }
        else if (mode == "inserted") {
            tid = result.insertId;
        }
        
        res.setHeader("Content-Type", "text/xml");
        res.send("<data><action type='" + mode + "' sid='" + sid + "' tid='" + tid + "'/></data>");
    }
    
    if (mode == "updated") {
        db.query("UPDATE tbl_shop_profile SET shop_id = ?,mall_id = ?,address = ?,floor = ?,category_id = ?,outlet = ?,phone = ? WHERE shop_profile_id = ?",
 			[shop_id, mall_id, address, floor, category_id, outlet, phone, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_shop_profile(shop_id,mall_id,address,floor,category_id,outlet,phone) VALUES (?,?,?,?,?,?,?)",
 			[shop_id, mall_id, address, floor, category_id,outlet,phone],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_shop_profile WHERE shop_profile_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

