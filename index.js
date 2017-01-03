var cmdArgs = process.argv.slice(2);
console.log("* BBKZTools Staring: " + cmdArgs);
// console.log("* dirname:"+ __dirname)

switch ((cmdArgs[0] || "").toLowerCase()) { 
  case '-phrase':
  	//bbkztools -phrase projectName savePath buildApp?
    //ex: bbkztools -phrase map map/phrase/ -app
    var phrase = require("./phrase") 
    phrase.build(cmdArgs[1], cmdArgs[2], (cmdArgs[3] == '-app'))
    return;
  default:
    console.log('default option')
}