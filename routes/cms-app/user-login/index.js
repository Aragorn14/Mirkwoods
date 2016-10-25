var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/user-login', function (req, res) {
    res.sendfile('cms-user-login.html', { "root": 'views/' });
});

app.get('/cms/user-login/getdata', function (req, res) {
    db.query("SELECT login_id AS id,user_id,username,status,user_type FROM tbl_user_login", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/user-login/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var user_id = data.user_id;
    var username = data.username;
    var status = data.status;
    var user_type = data.user_type;
    
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
        db.query("UPDATE tbl_user_login SET user_id = ?,username = ?,status = ?,user_type = ? WHERE login_id = ?",
 			[user_id, username, status, user_type, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_user_login(user_id,username,status,user_type) VALUES (?,?,?,?)",
 			[user_id, username, status, user_type],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_user_login WHERE login_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

