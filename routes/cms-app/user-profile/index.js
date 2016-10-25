var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/user-profile', function (req, res) {
    res.sendfile('cms-user-profile.html', { "root": 'views/' });
});

app.get('/cms/user-profile/getdata', function (req, res) {
    db.query("SELECT user_id AS id,user_id,qb_user_id,first_name,last_name,gender,dob,location,phone,profile_image_url,is_app_signup FROM tbl_user_profile", function (err, rows) {
        if (err) console.log(err);
        res.send(rows);
    });
});
app.post('/cms/user-profile/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var qb_user_id = data.qb_user_id;
    var first_name = data.first_name;
    var last_name = data.last_name;
    var gender = data.gender;
    var dob = data.dob;
    var location = data.location;
    var phone = data.phone;
    var profile_image_url = data.profile_image_url;
    var is_app_signup = data.is_app_signup;
    
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
        db.query("UPDATE tbl_user_profile SET qb_user_id = ?,first_name = ?,last_name = ?,gender = ?,dob = ?,location = ?,phone = ?,profile_image_url = ?,is_app_signup = ? WHERE user_id = ?",
 			[qb_user_id, first_name, last_name, gender, dob, location, phone, profile_image_url, is_app_signup, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_user_profile(qb_user_id,first_name,last_name,gender,dob,location,phone,profile_image_url,is_app_signup) VALUES (?,?,?,?,?,?,?,?,?)",
 			[qb_user_id, first_name, last_name, gender, dob, location, phone, profile_image_url, is_app_signup],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_user_profile WHERE user_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

