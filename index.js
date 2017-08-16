var cmdArgs = process.argv.slice(2);
console.log("* BBKZTools Staring: " + cmdArgs);
// console.log("* dirname:"+ __dirname)

switch ((cmdArgs[0] || "").toLowerCase()) { 
  case "-phrase":
  	//bbkztools -phrase projectName savePath="src/"
    //ex: bbkztools -phrase map
    var phrase = require("./phrase") 
    phrase.build(cmdArgs[1], cmdArgs[2])
    return;
  case "-livesync":
  	//bbkztools -livesync folderPath
  	var livesync = require("./livesync")
  	livesync.init(cmdArgs[1])
  	return;
  case "-plugin":
    //bbkztools -plugin products savePath ids
    //ex: bbkztools -plugin map,mapsearch map/plugin/ 1024,1
    var plugin = require("./plugin")
    plugin.build(cmdArgs[1], cmdArgs[2], cmdArgs[3])
    return;
  case "-sprite":
    //bbkztools -sprite name srcDir destDir lessPath cssPath vbPath
    //ex:bbkztools -sprite icons map/sprites/src/ clientscript/ icons.less
    var sprite = require("./sprite")
    sprite.build(cmdArgs[1],cmdArgs[2],cmdArgs[3],cmdArgs[4],cmdArgs[5],cmdArgs[6])
    return;
  default:
    console.log("* No Actions.")
}