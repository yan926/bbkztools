var cmdArgs = process.argv.slice(2);
console.log("* BBKZTools Staring: " + cmdArgs);
// console.log("* dirname:"+ __dirname)

switch ((cmdArgs[0] || "").toLowerCase()) { 
  case "-phrase":
  	//bbkztools -phrase savePath projectName buildApp?
    //ex: bbkztools -phrase map/phrase/ map -app
    var phrase = require("./phrase") 
    phrase.build(cmdArgs[1], cmdArgs[2], (cmdArgs[3] == "-app"))
    return;
  case "-livesync":
  	//bbkztools -livesync folderPath
  	var livesync = require("./livesync")
  	livesync.init(cmdArgs[1])
  	return;
  case "-plugin":
    //bbkztools -plugin savePath products ids
    //ex: bbkztools -plugin map/plugin/ map,mapsearch 1024,1
    var plugin = require("./plugin")
    plugin.build(cmdArgs[1], cmdArgs[2], cmdArgs[3])
    return;
  default:
    console.log("* No Actions.")
}