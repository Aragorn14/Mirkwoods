var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/brands', function(req, res){
res.sendfile('cms-brands.html', {"root": 'views/' });
});

app.get('/cms/brands/getalldata', function(req, res){
	db.query("SELECT brand_id AS id,brand_name,valid FROM tbl_brands ORDER BY brand_name ASC", function(err, rows){
		if (err) console.log(err);
		
		res.send(rows);
	});
});

app.post('/cms/brands/getalldata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var brand_name = data.brand_name;
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
		db.query("UPDATE tbl_brands SET brand_name=?, valid=? WHERE brand_id = ?",
			[brand_name,valid,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_brands(brand_name,valid) VALUES (?,?)",
			[brand_name,valid],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_brands WHERE brand_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
