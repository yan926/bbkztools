var fs = require('fs')
var request = require("request")
var xmlbuilder = require('xmlbuilder')
var _auth = require('./auth')

var phrase = {
  build:function(product,savefolder = '',toBuildApp =false) {
  	this.toBuildApp = toBuildApp
    this.product = product
    this.savefolder = savefolder
    var auth = _auth.get()
    request({
      url:  "http://" + auth['host'] + "/forum/phraseServer.php?product=" + product,
      method: "GET",
      headers: {'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/49.0.2623.112 Safari/537.36'},
      'auth': {
        'user': auth['authuser'],
        'pass': auth['authpass'],
        'sendImmediately': false
      }
    }, this.phraseCallback.bind(this));
  },
  phraseCallback:function(error, response, body){
    if (error) throw error;
    var data = JSON.parse(body);
    this.buildWebStrings(data);
    if(this.toBuildApp){
    	var appremove = ['vbsettings','wol']
    	this.buildAndroidStrings(data, ['text_tc','text'], 'values-zh/strings.xml',appremove);
    	this.buildAndroidStrings(data, ['text_sc','text'], 'values-zh-rCN/strings.xml',appremove);
    }
  },
  buildWebStrings:function(data){
    var savepath = this.savefolder + 'vbphrase';
    console.log(this.savefolder)
    var output = '';
    for(var key in data){
      output += '[fieldname: ' + key + ']\n';
      for(var item of data[key]){
        output += Object.keys(item).map(key => item[key]).filter(n => !!n).join('  ') + '\n';
      }
      output += '\n\n\n';
    }
    fs.writeFile(savepath,output,function(err){
      if (err) throw err;
    });
  },
  buildAndroidStrings:function(data, order, filename, remove){
    remove = remove || [];
    var savepath = this.savefolder + filename
    var doc = xmlbuilder.create('resources', {
      version: '1.0',
      encoding: 'UTF-8'
    });
    for(var key in data){
      if(remove.indexOf(key) != -1) continue;
      doc.com(key)
      for(var item of data[key]){
        var v = this.seletLanguage(item,order);
        if(v.indexOf('{2}') == -1){
          v = v.replace(/{([\d])}/g, function(v){return "%s"}); //%s
        }else{
          v = v.replace(/{([\d])}/g, function(v){ return '%' + v[1] + '$s'}); //%1$s
        }

        doc.ele('string', {'name': item['varname']}, v);
      }
    }
    fs.writeFile(savepath,doc.end({ pretty: true}),function(err){
      if (err) throw err;
    });
  },
  seletLanguage:function(terms,order){
    for(var lankey of order){
      var r = terms[lankey];
      if(r) return r;
    }
    return '';
  }
}

module.exports = phrase;