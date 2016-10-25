
/* global jBuilder */
/* global imageLib */
/* global dbConnectMongo */
/* global DEFS */
/* global cloudinary */

var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');


app.get('/cms/mall-images', function (req, res) {
    res.sendfile('cms-mall-images.html', { "root": 'views/' });
});

app.get('/cms/mall-images/getdata', function (req, res) {
    db.query("SELECT shopping_mall_image_id AS id,mall_id,image_type_id,public_id, 'No Image Present' AS url FROM tbl_shopping_mall_images;", function (err, rows) {
        if (err) console.log(err);
        var url, i;
        for(i = 0; i < rows.length; i++) {
          if(rows[i].public_id !== 'null') { 
            url = cloudinary.image(rows[i].public_id,{ width: 250, height: 150});
            rows[i].url = url;
          }
        }
        res.send(rows);
    });
});
app.post('/cms/mall-images/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var mall_id = data.mall_id;
    var image_type_id = data.image_type_id;
    var public_id = data.public_id;
    
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
        db.query("UPDATE tbl_shopping_mall_images SET mall_id = ?,image_type_id = ?,public_id = ? WHERE shopping_mall_image_id = ?",
 			[mall_id, image_type_id, public_id, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_shopping_mall_images(mall_id,image_type_id,public_id) VALUES (?,?,?)",
 			[mall_id, image_type_id, public_id],
 			update_response);
    }
    else if (mode == "deleted") {
        //cloudinary.uploader.destroy(public_id, function(result) { console.log(result) });
        db.query("DELETE FROM tbl_shopping_mall_images WHERE shopping_mall_image_id = ?", [sid], update_response);
    }
    else
        res.send("Not supported operation");
});

app.post('/cms/mall-images', function(req, res) {
  // files.name.path has the temp directory path 
  // which is to be used for file upload 
  var tagMallName, tagMallLocation, tagImageTypeName;
  var mall_id, image_type_id, str, public_id;

  mall_id = req.body.mall_id;
  image_type_id = req.body.image_type_id;
  tagImageTypeName = req.body.image_type_desc;
  str = req.body.mall_desc

  var arr = str.split("#");
  tagMallName = arr[0];
  tagMallLocation = arr[1];
  
  cloudinary.uploader.upload(req.files.mallimage.path, function(cloudinaryResult) {
      
    var libArray = {};
    libArray.public_id          = cloudinaryResult.public_id;
    libArray.orginalImageHeight = cloudinaryResult.height;
    libArray.orginalImageWidth  = cloudinaryResult.width;


    imageLib.getAllImageUrls(libArray, function(urlArray) {
      // Save to mongo DB
      var reqArrayLocal = {};
      reqArrayLocal.mall_id = Number(mall_id);
      reqArrayLocal.mall_name = req.body.mall_desc;
      reqArrayLocal.public_id = cloudinaryResult.public_id;
      reqArrayLocal.image_type_id = Number(image_type_id);
      reqArrayLocal.image_type = req.body.image_type_desc;
      reqArrayLocal.ldpi = urlArray['ldpiUrl'];
      reqArrayLocal.mdpi = urlArray['mdpiUrl'];
      reqArrayLocal.hdpi = urlArray['hdpiUrl'];
      var collection = dbConnectMongo.collection('tbl_shopping_mall_images');
        jBuilder.buildMongoImageJson(reqArrayLocal, function(jsonData) {
            collection.update({mall_id:jsonData.mall_id, "images.image_type_id": jsonData.images.image_type_id}, jsonData, {upsert:true}, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log('SCUBE-IMAGE-LOG: Inserted documents into the "shopping malls" collection. The public id inserted is:'+cloudinaryResult.public_id);
              }
              //dbConnectMongo.close();  
            });
        });
    });
    
    public_id = cloudinaryResult.public_id;
    db.query("UPDATE tbl_shopping_mall_images SET public_id = ? WHERE mall_id = ? AND image_type_id = ? ",
    [public_id, mall_id, image_type_id]); 
    res.sendfile('cms-mall-images.html', { "root": 'views/' });
    }, { tags:[ tagMallName, tagMallLocation, tagImageTypeName]});
});

