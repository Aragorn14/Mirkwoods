var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/device-login', function(req, res){
res.sendfile('cms-device-login.html', {"root": 'views/' });
});

app.get('/cms/device-login/getdata', function(req, res){
    db.query("SELECT device_login_id AS id,device_id, user_id, logged_in, login_timestamp, logoff_timestamp FROM tbl_device_login", function (err, rows){
		if (err) console.log(err);

		res.send(rows);
	});
});


app.post('/cms/device-login/getdata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var device_id = data.device_id;
    var user_id = data.user_id;
    var logged_in = data.logged_in;
    var login_timestamp = data.login_timestamp;
    var logoff_timestamp = data.logoff_timestamp;

	function update_response(err, result){
		if (err){
			console.log(err);
			mode = "error";
		}

        else if (mode == "inserted") {
            tid = result.insertId;
        }
			

		res.setHeader("Content-Type","text/xml");
		res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
	}

	if (mode == "updated"){
		db.query("UPDATE tbl_device_login SET device_id = ?, user_id = ?, logged_in = ? , login_timestamp = ?, logoff_timestamp = ? WHERE device_login_id = ?",
			[device_id,user_id,logged_in,login_timestamp,logoff_timestamp,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_device_login(device_id,user_id,logged_in,login_timestamp,logoff_timestamp) VALUES (?,?,?,?,?)",
			[device_id, user_id, logged_in, login_timestamp, logoff_timestamp],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_device_login WHERE device_login_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
