var fs = require('fs')
var request = require("request")
var _auth = require('./auth')
var sanitize = require("sanitize-filename");

var plugin = {
  build:function(savefolder = "", productStr = "", idStr = "") {
    if(!productStr && !idStr) throw new Error("No Plugin Argv");
    this.savefolder = savefolder

    var products = productStr.split(",").map(x => "product[]="+x).join("&");
    var ids = idStr.split(",").map(x => "id[]="+x).join("&");
    var auth = _auth.get()
    request({
      url:  "http://" + auth['host'] + "/forum/pluginServer.php?" + products + "&" + ids,
      method: "GET",
      headers: {'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/49.0.2623.112 Safari/537.36'},
      'auth': {
        'user': auth['authuser'],
        'pass': auth['authpass'],
        'sendImmediately': false
      }
    }, this.pluginCallback.bind(this));
  },
  pluginCallback:function(error, response, body){
    if (error) throw error;
    var data = JSON.parse(body);
    console.log("* Save Plugin to: " + this.savefolder)
    for (let v of data) {
      var savepath = this.savefolder + sanitize(v.title + "." +  v.pluginid + ".php");
      var output = '<? /*\n';
      output += 'pluginid: ' + v.pluginid + '\n';
      output += 'title: ' + v.title + '\n';
      output += 'hookname: ' + v.hookname + '\n';
      output += 'product: ' + v.product + '\n';
      output += 'active: ' + v.active + '\n';
      output += 'executionorder: ' + v.executionorder + '\n';
      output += '*/\n\n';
      output += v.phpcode;
      fs.writeFile(savepath,output,function(err){
        if (err) throw err;
      });
    }
  }
}


module.exports = plugin;