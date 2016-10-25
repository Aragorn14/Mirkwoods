#!/usr/bin/env python
from __future__ import print_function
import os

line_count = 0
tbl_name = "none"
pkey = "none"
api = "none"
page_name = "none"

col_disp_name_list = []
col_sql_name_list = []
col_width_list = []
col_data_list = []
col_type_list = []
col_api_list = []
col_add_val_list = []

def prepare_str_list(mylist):
    i = 0
    mystring =""

    for item in mylist:
        if i == 0:
            mystring += item
            i = 1
        else:
            mystring += ','
            mystring += item

    return mystring

def prepare_update_str(my_list):
    i = 0
    mystring =""

    for item in my_list:
        if i == 0:
            mystring += item
            mystring += " = ?"
            i = 1
        else:
            mystring += ","
            mystring += item
            mystring += " = ?"

    return mystring

def prepare_insert_str(my_list):
    i = 0
    mystring =""

    for item in my_list:
        if i == 0:
            mystring += "?"
            i = 1
        else:
            mystring += ","
            mystring += "?"

    return mystring


def prepare_post_var(my_list):
    mystring = ""
    i = 0

    for item in my_list:
        if i == 0:
            mystring += "var "+item+" = data."+item+";\n"
            i = 1
        else:
            mystring += "\tvar "+item+" = data."+item+";\n"

    return mystring

    
with open('sql_input') as f:
    for line in f:
        line = line.rstrip(' \t\n\r')
        split_line = line.split('#')
       
        #line 0 has the API
        if line_count == 2:
            table_name = split_line[0].strip()
            pkey = split_line[1].strip()
            api = split_line[2].strip()
            page_name = split_line[3].strip()
        #data starts from line # 4
        if line_count > 5:
            col_disp_name_list.append(split_line[0].strip())
            col_sql_name_list.append(split_line[1].strip())
            col_width_list.append(split_line[2].strip())
            col_data_list.append(split_line[3].strip())
            col_type_list.append(split_line[4].strip())
            col_api_list.append(split_line[5].strip())
            col_add_val_list.append(split_line[6].strip())

        line_count+=1

        
os.remove('./html')
out_html_file=open('./html', 'a')

print("<!doctype html>\n \
<head>\n \
    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\"> \n \
    <title>"+page_name+" CMS</title>\n \
</head>\n \
    <script src=\"../js/data-grid/dhtmlxcommon.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n \
    <script src=\"../js/data-grid/dhtmlxgrid.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n \
    <script src=\"../js/data-grid/dhtmlxgridcell.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n \
    <script src=\"../js/data-grid/dhtmlxdataprocessor.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n \
    <script src=\"../js/data-grid/dhtmlxcombo.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\n \
    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script>\n \
    <link rel=\"stylesheet\" href=\"../styles/dhtmlxgrid.css\" type=\"text/css\" media=\"screen\" title=\"no title\" charset=\"utf-8\">\n \
    <link rel=\"stylesheet\" href=\"../styles/data-grid-skins/dhtmlxgrid_dhx_skyblue.css\" type=\"text/css\" media=\"screen\" title=\"no title\" charset=\"utf-8\">\n ",file=out_html_file)

print("<script type=\"text/javascript\" charset=\"utf-8\">", file=out_html_file)
print("\tfunction init() {", file=out_html_file)
print("\t\tmy_grid = new dhtmlXGridObject(\"grid_"+api+"\");", file=out_html_file);
print("\t\tmy_grid.setImagePath(\"../images/data-grid-images/\");",file=out_html_file);

my_str = prepare_str_list(col_disp_name_list)
print("\t\tmy_grid.setHeader(\""+my_str+"\");",file=out_html_file);

my_str = prepare_str_list(col_sql_name_list)
print("\t\tmy_grid.setColumnIds(\""+my_str+"\");",file=out_html_file);
    
my_str = prepare_str_list(col_width_list)
print("\t\tmy_grid.setInitWidths(\""+my_str+"\");",file=out_html_file);

my_str = prepare_str_list(col_type_list)
print("\t\tmy_grid.setColTypes(\""+my_str+"\");",file=out_html_file);

my_str = prepare_str_list(col_data_list)
print("\t\tmy_grid.setColSorting(\""+my_str+"\");",file=out_html_file);

print("\t\tmy_grid.setSkin(\"dhx_skyblue\");", file=out_html_file);

print("\n\n", file=out_html_file);

i=0
for item in col_api_list:
    if cmp(item,"none") == 0:
        #do nothing
        i += 1
    else:
        item_original = item
        item = item.replace('-','_')
        print("\t\tvar "+item+" = my_grid.getCombo(my_grid.\
getColIndexById(\""+col_sql_name_list[i].strip()+"\"));", file=out_html_file)
        print("\t\t\t$.ajax({", file=out_html_file)
        print("\t\t\t\ttype: \"GET\",", file=out_html_file)
        print("\t\t\t\turl: \"/cms/"+item_original+"/getdata/\",", file=out_html_file)
        print("\t\t\t\tsuccess: function (result) {", file=out_html_file)
        print("\t\t\t\t\tresult.forEach(function (item) {", file=out_html_file)
        print("\t\t\t\t\t\t"+item+".put(item.id, item.description);", file=out_html_file)
        print("\t\t\t\t\t});", file=out_html_file);
        print("\t\t\t\t},", file=out_html_file)
        print("\t\t\t\tasync : false", file=out_html_file)
        print("\t\t\t\t});", file=out_html_file)
        print("\t\t\n\n", file=out_html_file)
        i+=1

print("\t\tmy_grid.init();", file=out_html_file)
print("\t\tmy_grid.load(\"/cms/"+api+"/getdata\", \"js\")", file=out_html_file)
print("\t\tdp = new dataProcessor(\"/cms/"+api+"/getdata\");", file=out_html_file)
print("\t\tdp.init(my_grid);", file=out_html_file)
print("\t\tdp.enableDataNames(true);", file=out_html_file)
print("\t\tdp.setTransactionMode(\"POST\", false);", file=out_html_file)
print("\t\t}", file=out_html_file)


print("\n\n\n", file=out_html_file)
print("\tfunction addrow(){", file=out_html_file)
print("\t\tvar id = my_grid.uid();", file=out_html_file)
print("\t\tmy_grid.setActive(true);", file=out_html_file)
my_str = prepare_str_list(col_add_val_list)
print("\t\tmy_grid.addRow(id, \""+my_str+"\");", file=out_html_file)
print("\t}", file=out_html_file)


print("\tfunction deleterow() {\n\
         var r = confirm(\"Do you really want to delete the record.\");\n\
         if (r == true) {\n\
             my_grid.deleteSelectedRows();\n\
         }\n\
     }\n", file=out_html_file);


print("\tfunction updaterow() {", file=out_html_file)
print("\t}", file=out_html_file)

print("</script>", file=out_html_file)

print("<body onload=\"init();\">\n \
    <br>\n \
    <h3>CMS -"+page_name+" Table</h3>\n \
    <div id=\"grid_"+api+"\" style=\"width:1250px; height:500px;\"></div>\n \
    <br>\n \
        <input style=\"padding:6px;\" type=\"button\" value=\"Add a new record\" onclick=\"addrow()\">\n \
        <input style=\"padding:6px;\" type=\"button\" value=\"Update the selected record\" onclick=\"updaterow()\">\n \
        <input style=\"padding:6px;\" type=\"button\" value=\"Delete the selected record\" onclick=\"deleterow()\">\n \
</body>\n ", file=out_html_file)


print("The HTM File is generated \n")



os.remove('./index.js')
out_index_file=open('./index.js', 'a')


print("var express  = require('express');", file=out_index_file)
print("var app      = module.exports = express();", file=out_index_file)
print("var db       = require(DEFS.DIR.DB_CONNECT)('openshift');\n\n", file=out_index_file)

print("app.get('/cms/"+api+"', function(req, res){", file=out_index_file)
print("\tres.sendfile('cms-"+api+".html', {\"root\": 'views/' });", file=out_index_file)
print("});\n", file=out_index_file)

print("app.get('/cms/"+api+"/getdata', function (req, res) {", file=out_index_file)

my_str = prepare_str_list(col_sql_name_list)
print("\tdb.query(\"SELECT "+pkey+" AS id,"+ my_str +" FROM "+table_name+"\", function (err, rows) {", file=out_index_file)
print("\t\tif (err) console.log(err);", file=out_index_file)
print("\t\tres.send(rows);", file=out_index_file)
print("\t});", file=out_index_file)
print("});", file=out_index_file)

update_str = prepare_update_str(col_sql_name_list)
insert_str = prepare_insert_str(col_sql_name_list)
my_var_str = prepare_post_var(col_sql_name_list)

print("app.post('/cms/"+api+"/getdata', function(req, res){\n \
	var data = req.body;\n \
	var mode = data[\"!nativeeditor_status\"];\n \
	var sid = data.gr_id;\n \
	var tid = sid;\n\n \
	"+my_var_str+"\nfunction update_response(err, result){ \n \
		if (err){\n \
			console.log(err);\n \
			mode = \"error\";\n \
		}\n \
        else if (mode == \"inserted\") {\n \
            tid = result.insertId;\n \
        }\n\n \
		res.setHeader(\"Content-Type\",\"text/xml\"); \n \
		res.send(\"<data><action type='\"+mode+\"' sid='\"+sid+\"' tid='\"+tid+\"'/></data>\");\n \
	}\n\n \
	if (mode == \"updated\"){ \n \
		db.query(\"UPDATE "+table_name+" SET "+update_str+" WHERE "+pkey+" = ?\",\n \
			["+my_str+",sid],\n \
			update_response);\n \
	}\n \
    else if (mode == \"inserted\") {\n \
		db.query(\"INSERT INTO "+table_name+"("+my_str+") VALUES ("+insert_str+")\",\n \
			["+my_str+"],\n \
			update_response);\n \
	}\n \
	else if (mode == \"deleted\")\n \
		db.query(\"DELETE FROM "+table_name+" WHERE "+pkey+" = ?\", [sid], update_response);\n \
	else \n \
		res.send(\"Not supported operation\");\n \
});\n", file=out_index_file)

print ("The index.js file is generated\n");
