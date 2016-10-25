var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/shop', function (req, res) {
    res.sendfile('cms-shop.html', { "root": 'views/' });
});

app.get('/cms/shop/getdata', function (req, res) {
    db.query("SELECT shop_id AS id,shop_name FROM tbl_shops", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/shop/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var shop_name = data.shop_name;
    
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
        db.query("UPDATE tbl_shops SET shop_name = ? WHERE shop_id = ?",
 			[shop_name, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_shops(shop_name) VALUES (?)",
 			[shop_name],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_shops WHERE shop_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

