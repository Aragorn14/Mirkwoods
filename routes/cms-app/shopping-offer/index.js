var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/shopping-offer', function (req, res) {
    res.sendfile('cms-shopping-offer.html', { "root": 'views/' });
});

app.get('/cms/shopping-offer/getdata', function (req, res) {
    db.query("SELECT offer_id AS id,offer_name FROM tbl_shopping_offers", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/shopping-offer/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var offer_name = data.offer_name;
    
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
        db.query("UPDATE tbl_shopping_offers SET offer_name = ? WHERE offer_id = ?",
 			[offer_name, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_shopping_offers(offer_name) VALUES (?)",
 			[offer_name],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_shopping_offers WHERE offer_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

