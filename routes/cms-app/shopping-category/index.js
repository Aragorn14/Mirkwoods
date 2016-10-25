var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/shopping-category', function (req, res) {
    res.sendfile('cms-shopping-category.html', { "root": 'views/' });
});

app.get('/cms/shopping-category/getdata', function (req, res) {
    db.query("SELECT category_id AS id,category_name FROM tbl_shopping_category", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/shopping-category/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var category_name = data.category_name;
    
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
        db.query("UPDATE tbl_shopping_category SET category_name = ? WHERE category_id = ?",
 			[category_name, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_shopping_category(category_name) VALUES (?)",
 			[category_name],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_shopping_category WHERE category_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

