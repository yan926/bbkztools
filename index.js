var cmdArgs = process.argv.slice(1); //need to change 1
console.log("Welcome to bbkztools:" + cmdArgs);
console.log("* dirname:"+ __dirname)

switch ((cmdArgs[0] || "").toLowerCase()) { 
  case '-phrase':
    //bbkztools -phrase map /map/phrase/ -app
    var phrase = require("./phrase") 
    phrase.build(cmdArgs[1], cmdArgs[2], (cmdArgs[3] == '-app'))
    return;
  default:
    console.log('default option')
}