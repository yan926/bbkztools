var fs = require('fs');
// var authpath = 'sftp-config.json';
var authpath = '../../pysettings.json';
var auth = {
	get:function(t){
    t = t || 'demo'
		if(!this.authdata) {
			this.authdata = JSON.parse(fs.readFileSync(authpath, 'utf8'))
		}
		if(!this.authdata) throw new Error("No Auth File");
		return this.authdata[t]
	}
}
module.exports = auth;