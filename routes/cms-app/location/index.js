var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/location', function(req, res){
res.sendfile('cms-location.html', {"root": 'views/' });
});

app.get('/cms/location/getalldata', function(req, res){
	db.query("SELECT location_id AS id,state_id,description,verified FROM tbl_location ORDER BY description ASC", function(err, rows){
		if (err) console.log(err);
		
		res.send(rows);
	});
});

app.post('/cms/location/getalldata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var description = data.description;
    var valid = data.verified;
    var state_id = data.state_id;

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
		db.query("UPDATE tbl_location SET description=?, verified=?, state_id=? WHERE location_id = ?",
			[description,valid,state_id,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_location(description,state_id,verified) VALUES (?,?,?)",
			[description, state_id,valid],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_location WHERE location_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
