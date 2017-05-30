var fs = require('fs')
var request = require("request")
var _auth = require('./auth')

var phrase = {
  build:function(product, savefolder){
    if(!product) console.log("* [Error] Phrase Need Product Name!")
    savefolder = savefolder || 'src/'
    this.savepath = savefolder + product + ".phrase";
    var auth = _auth.get()
    request({
      url:  "http://" + auth['host'] + "/forum/phraseServer.php?product=" + product,
      method: "GET",
      headers: {'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/49.0.2623.112 Safari/537.36'},
      'auth': {
        'user': auth['http_auth_account'],
        'pass': auth['http_auth_password'],
        'sendImmediately': false
      }
    }, this.phraseCallback.bind(this));
  },
  phraseCallback:function(error, response, body){
    if (error) throw error;
    var data = JSON.parse(body);
    
    //build
    var output = '';
    for(var key in data){
      output += '[fieldname: ' + key + ']\n';
      for(var item of data[key]){
        output += Object.keys(item).map(key => item[key]).filter(n => !!n).join('  ') + '\n';
      }
      output += '\n\n\n';
    }
    console.log("* Save Phrase to: " + this.savepath)
    fs.writeFile(this.savepath,output,function(err){
      if (err) throw err;
    });
  }
}

module.exports = phrase;