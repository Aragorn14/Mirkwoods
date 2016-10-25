var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/scubit', function (req, res) {
    res.sendfile('cms-scubit.html', { "root": 'views/' });
});

app.get('/cms/scubit/getdata', function (req, res) {
    db.query("SELECT scubit_id AS id,shop_profile_id,brand_id,user_id,gender_id,offer_id,price_range_id,payment_type_id,num_items,start_date,end_date,notes,photo_url,valid FROM tbl_scubit", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});




app.post('/cms/scubit/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var shop_profile_id = data.shop_profile_id;
    var brand_id = data.brand_id;
    var user_id = data.user_id;
    var gender_id = data.gender_id;
    var offer_id = data.offer_id;
    var price_range_id = data.price_range_id;
    var payment_id = data.payment_type_id;
    var num_items = data.num_items;
    var start_date = data.start_date;
    var end_date = data.end_date;
    var notes = data.notes;
    var photo_url = data.photo_url;
    var valid = data.valid;
    
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
        db.query("UPDATE tbl_scubit SET shop_profile_id = ?,brand_id = ?,user_id = ?,gender_id = ?,offer_id = ?,price_range_id = ?,payment_type_id = ?,num_items = ?,start_date = ?,end_date = ?,notes = ?,photo_url = ?,valid = ? WHERE scubit_id = ?",
 			[shop_profile_id, brand_id, user_id, gender_id, offer_id, price_range_id, payment_id, num_items, start_date, end_date, notes, photo_url, valid, sid],
 			update_response);
        //db.query("CALL usp_update_scubit_counts(?,?)", [shop_profile_id, brand_id], update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_scubit(shop_profile_id,brand_id,user_id,gender_id,offer_id,price_range_id,payment_type_id,num_items,start_date,end_date,notes,photo_url,valid,create_ts,update_ts) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
 			[shop_profile_id, brand_id, user_id, gender_id, offer_id, price_range_id, payment_id, num_items, start_date, end_date, notes, photo_url, valid, null, null],
 			update_response);
    }
    else if (mode == "deleted") {
        //db.query("CALL usp_delete_scubit(?)", [sid], update_response);
        db.query("DELETE FROM tbl_scubit WHERE scubit_id = ?", [sid], update_response);
    }
    else
        res.send("Not supported operation");
});

