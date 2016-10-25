var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/popularity-index', function(req, res){
res.sendfile('cms-popularity-index.html', {"root": 'views/' });
});

app.get('/cms/popularity/getdata', function (req, res) {
    db.query("SELECT popularity_id AS id ,description FROM tbl_popularity_index ORDER BY description", function (err, rows) {
        if (err) console.log(err);
        
        res.send(rows);
    });
});

app.post('/cms/popularity/getdata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var description = data.description;

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
		db.query("UPDATE tbl_popularity_index SET description=? WHERE popularity_id = ?",
			[description,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_popularity_index(description) VALUES (?)",
			[description],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_popularity_index WHERE popularity_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
