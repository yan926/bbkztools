console.log("Welcome to bbkztools");

var cmdArgs = process.argv.slice(2);
switch ((cmdArgs[0] || "").toLowerCase()) { 
  case 'build':
    console.log('build is input')
    return;
  default:
    console.log('default option')
}