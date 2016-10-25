var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/device-type', function(req, res){
res.sendfile('cms-device-type.html', {"root": 'views/' });
});

app.get('/cms/device-type/getalldata', function(req, res){
	db.query("SELECT device_type_id AS id,description,valid FROM tbl_device_type ORDER BY description ASC", function(err, rows){
		if (err) console.log(err);
		
		res.send(rows);
	});
});

app.post('/cms/device-type/getalldata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var description = data.description;
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
		db.query("UPDATE tbl_device_type SET description=?, valid=? WHERE device_type_id = ?",
			[description,valid,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_device_type(description,valid) VALUES (?,?)",
			[description,valid],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_device_type WHERE device_type_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
