var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/scube-deals', function (req, res) {
    res.sendfile('cms-scube-deals.html', { "root": 'views/' });
});

app.get('/cms/scube-deals/getdata', function (req, res) {
    db.query("SELECT scube_deal_id AS id,shop_profile_id,brand_id,offer_id,start_date,end_date,notes,photo_url,valid FROM tbl_scube_deals", 
        function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});




app.post('/cms/scube-deals/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var shop_profile_id = data.shop_profile_id;
    var brand_id = data.brand_id;
    var offer_id = data.offer_id;
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
        db.query("UPDATE tbl_scube_deals SET shop_profile_id = ?,brand_id = ?,offer_id = ?,start_date = ?,"+ 
            "end_date = ?,notes = ?,photo_url = ?,valid = ? WHERE scube_deal_id = ?",
 			[shop_profile_id, brand_id, offer_id, start_date, end_date, notes, photo_url, valid, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_scube_deals(shop_profile_id,brand_id,offer_id,start_date,end_date,notes,photo_url,valid,create_ts, update_ts)" + 
            "VALUES (?,?,?,?,?,?,?,?,?,?)",
 			[shop_profile_id, brand_id, offer_id, start_date, end_date, notes, photo_url, valid, null, null],
 			update_response);
    }
    else if (mode == "deleted") {
        db.query("DELETE FROM tbl_scube_deals WHERE scube_deal_id = ?", [sid], update_response);
    }
    else
        res.send("Not supported operation");
});

