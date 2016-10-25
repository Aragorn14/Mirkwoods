/* global jBuilder */
/* global imageLib */
/* global dbConnectMongo */
/* global DEFS */
/* global cloudinary */
var express = require('express');
var app = module.exports = express();
var db = require(DEFS.DIR.DB_CONNECT)('openshift');
var mongodb = require(DEFS.DIR.DB_CONNECT)('openshift_mongo'); // set global variable db connection

app.get('/cms/brand-images', function (req, res) {
    res.sendfile('cms-brand-images.html', { "root": 'views/' });
});

app.get('/cms/brand-images/getdata', function (req, res) {
    db.query("SELECT brand_image_id AS id,brand_id,image_type_id,public_id, 'No Image Present' AS url FROM tbl_brands_images", function (err, rows) {
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

app.post('/cms/brand-images/getdata', function (req, res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.gr_id;
    var tid = sid;
    
    var brand_id = data.brand_id;
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
        db.query("UPDATE tbl_brands_images SET brand_id = ?,image_type_id = ?,public_id = ? WHERE brand_image_id = ?",
 			[brand_id, image_type_id, public_id, sid],
 			update_response);
    }
    else if (mode == "inserted") {
        db.query("INSERT INTO tbl_brands_images(brand_id,image_type_id,public_id) VALUES (?,?,?)",
 			[brand_id, image_type_id, public_id],
 			update_response);
    }
    else if (mode == "deleted")
        db.query("DELETE FROM tbl_brands_images WHERE brand_image_id = ?", [sid], update_response);
    else
        res.send("Not supported operation");
});

app.post('/cms/brand-images', function(req, res) {
    
  // files.name.path has the temp directory path 
  // which is to be used for file upload 
  var tagBrandName, tagImageTypeName;
  var brand_id, image_type_id;

  brand_id = req.body.brand_id;
  image_type_id = req.body.image_type_id;
  tagImageTypeName = req.body.image_type_desc;
  tagBrandName = req.body.brand_desc;
  
  cloudinary.uploader.upload(req.files.brandimage.path, function(cloudinaryResult) {

    var libArray = {};
    libArray.public_id          = cloudinaryResult.public_id;
    libArray.orginalImageHeight = cloudinaryResult.height;
    libArray.orginalImageWidth  = cloudinaryResult.width;


    imageLib.getAllImageUrls(libArray, function(urlArray) {
      // Save to mongo DB
      var reqArrayLocal = {};
      reqArrayLocal.brand_id = Number(brand_id);
      reqArrayLocal.brand_name = req.body.brand_desc;
      reqArrayLocal.public_id = cloudinaryResult.public_id;
      reqArrayLocal.image_type_id = Number(image_type_id);
      reqArrayLocal.image_type = req.body.image_type_desc;
      reqArrayLocal.ldpi = urlArray['ldpiUrl'];
      reqArrayLocal.mdpi = urlArray['mdpiUrl'];
      reqArrayLocal.hdpi = urlArray['hdpiUrl'];
      var collection = dbConnectMongo.collection('tbl_brands_images');
        jBuilder.buildMongoImageJson(reqArrayLocal, function(jsonData) {
            
            collection.update({"brand_id":jsonData.brand_id, "images.image_type_id": jsonData.images.image_type_id}, jsonData, {upsert:true},{multi: true} , function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log('SCUBE-IMAGE-LOG: Inserted documents into the "brands" collection. The public id inserted is:'+cloudinaryResult.public_id);
              }
              //dbConnectMongo.close();  
            });
        });
    });

    db.query("UPDATE tbl_brands_images SET public_id = ? WHERE brand_id = ? AND image_type_id = ? ",
    [cloudinaryResult.public_id, brand_id, image_type_id]); 
    res.sendfile('cms-brand-images.html', { "root": 'views/' });
    }, { tags:[ tagBrandName, tagImageTypeName]});
});

