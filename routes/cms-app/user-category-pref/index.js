var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/user-category-pref', function (req, res) {
    res.sendfile('cms-user-category-pref.html', { "root": 'views/' });
});

app.get('/cms/user-category-pref/getdata', function (req, res) {
    db.query("SELECT category_pref_id AS id,user_id,category_id,valid FROM tbl_user_category_pref", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/user-category-pref/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var user_id = data.user_id;
    var category_id = data.category_id;
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
        db.query("UPDATE tbl_user_category_pref SET user_id = ?,category_id = ?,valid = ? WHERE category_pref_id = ?",
 			[user_id, category_id, valid, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_user_category_pref(user_id,category_id,valid) VALUES (?,?,?)",
 			[user_id, category_id, valid],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_user_category_pref WHERE category_pref_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

