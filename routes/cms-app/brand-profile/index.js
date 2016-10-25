var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/brand-profile', function(req, res){
res.sendfile('cms-brand-profile.html', {"root": 'views/' });
});

app.get('/cms/brand-profile/getdata', function(req, res){
    db.query("SELECT brand_profile_id AS id,shop_id,BRAND_PROFILE.brand_id,category_id, COUNT(scubit_id) AS scubit_cnt, outlet " + 
			 "FROM tbl_brand_profile BRAND_PROFILE " + 
			 "LEFT JOIN tbl_scubit AS SCUBIT ON (BRAND_PROFILE.shop_id = SCUBIT.shop_profile_id AND BRAND_PROFILE.brand_id = SCUBIT.brand_id) " + 
			 "GROUP BY id ORDER BY shop_id ASC,brand_id ASC;", function (err, rows){
		if (err) console.log(err);

		res.send(rows);
	});
});

app.post('/cms/brand-profile/getdata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;
    
    var shop_id = data.shop_id;
    var brand_id = data.brand_id;
    var category_id = data.category_id;
    var outlet = data.outlet;

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
		db.query("UPDATE tbl_brand_profile SET shop_id = ?, brand_id = ?, category_id = ? , outlet = ? WHERE brand_profile_id = ?",
			[shop_id,brand_id,category_id, outlet,sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_brand_profile(shop_id,brand_id,category_id,outlet) VALUES (?,?,?,?)",
			[shop_id, brand_id, category_id, outlet],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_brand_profile WHERE brand_profile_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
