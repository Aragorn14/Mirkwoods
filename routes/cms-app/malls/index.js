var express           = require('express');
var app               = module.exports = express();

var db = require(DEFS.DIR.DB_CONNECT)('openshift');

app.get('/cms/malls', function(req, res){
res.sendfile('cms-mall.html', {"root": 'views/' });
});

app.get('/cms/malls/getdata', function(req, res){
    db.query("SELECT SMALL.mall_id as id,mall_name,location_id,SMALL.address,popularity_index,COUNT(scubit_id) AS scubit_cnt,latitude,longitude " +
			 "FROM tbl_shopping_mall SMALL " +
			 "INNER JOIN tbl_shop_profile AS SHOP_PROFILE ON (SHOP_PROFILE.mall_id = SMALL.mall_id) " +
			 "LEFT JOIN tbl_scubit AS SCUBIT ON (SCUBIT.shop_profile_id = SHOP_PROFILE.shop_profile_id) " +
			 "GROUP BY id " +
			 "ORDER BY mall_name ASC; ", function (err, rows){
		if (err) console.log(err);

		res.send(rows);
	});
});

app.post('/cms/malls/getdata', function(req, res){
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.gr_id;
	var tid = sid;

	var mall_name = data.mall_name;
	var address  = data.address;
	var location  = data.location_id;
    var popularity_index = data.popularity_index;
    var latitude = data.latitude;
    var longitude = data.longitude;

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
		db.query("UPDATE tbl_shopping_mall SET mall_name = ?, location_id = ?, address = ? , popularity_index = ?, latitude = ?, longitude = ? WHERE mall_id = ?",
			[mall_name, location, address, popularity_index, latitude, longitude, sid],
			update_response);
	}
    else if (mode == "inserted") {
		db.query("INSERT INTO tbl_shopping_mall(mall_name, location_id, address, popularity_index, latitude, longitude) VALUES (?,?,?,?,?,?)",
			[mall_name, location, address, popularity_index, latitude, longitude],
			update_response);

	}
	else if (mode == "deleted")
		db.query("DELETE FROM tbl_shopping_mall WHERE mall_id = ?", [sid], update_response);
	else
		res.send("Not supported operation");
});
