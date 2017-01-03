var fs = require('fs');
var authpath = __dirname+'/sftp-config.json';
var auth = {
	get:function(){
		if(!this.authdata) {
			console.log("* GET AUTH")
			this.authdata = JSON.parse(fs.readFileSync(authpath, 'utf8'))
		}
		if(!this.authdata) throw new Error("No Auth File");
		return this.authdata
	}
}
module.exports = auth;