var fs = require('fs')
var spritesmith = require('spritesmith');
var handlebars = require('handlebars');
var path = require('path')
const {execFile} = require('child_process');
const optipng = require('optipng-bin');

var sprite = {
  build:function(name, srcDir, destDir, cssPath) {
    var retinaPrefix = "-2x"
    var srcFiles = fs.readdirSync(srcDir)
    var src1 = []
    var src2 = []
  
    var destPath = destDir + name + ".png"
    var retinaDestPath = destDir + name + retinaPrefix + ".png"
    
    var data = {
      destPath: destPath,
      retinaDestPath: retinaDestPath,
      version: Date.now(),
      sprites: []
    }

    var template = ""
    for(var f of srcFiles){
      var fpath = srcDir + f;
      if(f.includes(".png")){
        (f.includes(retinaPrefix + ".png"))? src2.push(fpath) : src1.push(fpath)  
      }else if(f.includes(".handlebars")){
        var hsource = fs.readFileSync(fpath, "utf8")
        template = handlebars.compile(hsource)
      }
    }

    spritesmith.run({src: src1}, function handleResult (err, r) {
      if(err) throw err;
      fs.writeFileSync(destPath, r.image);
      execFile(optipng, [destPath], err => { console.log('→ Build: ' + destPath ) });
      // r.coordinates r.properties
      if(template && cssPath){
        data.w = r.properties.width+"px"
        data.h = r.properties.height+"px"
        for(var i in r.coordinates){
          data.sprites.push({
            name: path.basename(i,".png"),
            x: -r.coordinates[i]['x']+"px",
            y: r.coordinates[i]['y']+"px",
            w: r.coordinates[i]['width']+"px",
            h: r.coordinates[i]['height']+"px"
          })
        }
        var css = template(data);
        fs.writeFileSync(cssPath, css);
        console.log('→ Build: ' + cssPath)
      } 
    });
    spritesmith.run({src: src2}, function handleResult (err, result) {
      if(err) throw err;
      fs.writeFileSync(retinaDestPath, result.image);
      execFile(optipng, [retinaDestPath], err => { console.log('→ Build: ' + retinaDestPath) });
    });
  }

}

module.exports = sprite;