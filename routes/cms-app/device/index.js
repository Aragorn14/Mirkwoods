var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/device', function(req, res){
res.sendfile('cms-device.html', {"root": 'views/' });
});

app.get('/cms/device/getdata', function(req, res){
    db.query("SELECT device_id AS id, imei,gcm_reg_id,device_type,device_variant,device_os,valid FROM tbl_device;", function (err, rows){
		if (err) console.log(err);

		res.send(rows);
	});
});


app.post('/cms/device/getdata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var imei = data.imei;
    var gcm_reg_id = data.gcm_reg_id;
    var device_type = data.device_type;
    var device_variant = data.device_variant;
    var device_os = data.device_os;
    var valid = data.valid;

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
		db.query("UPDATE tbl_device SET device_type = ?, device_variant = ?, device_os = ? , imei = ?, gcm_reg_id = ?, valid = ? WHERE device_id = ?",
			[device_type,device_variant,device_os,imei,gcm_reg_id,valid,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_device(device_type,device_variant,device_os,imei,gcm_reg_id,valid) VALUES (?,?,?,?,?,?)",
			[device_type, device_variant, device_os, imei, gcm_reg_id, valid],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_device WHERE device_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
