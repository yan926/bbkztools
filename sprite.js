var fs = require('fs')
var spritesmith = require('spritesmith');
var handlebars = require('handlebars');
var path = require('path')
const {execFile} = require('child_process');

var sprite = {
  build:function(name, srcDir, destDir, lessPath, cssPath, vbPath) {
    var retinaPrefix = "@2x"
    var srcFiles = fs.readdirSync(srcDir)
    var src1 = []
    var src2 = []
    
    var destName = name + ".png" 
    var destPath = destDir + destName
    var retinaDestName = name + retinaPrefix + ".png" 
    var retinaDestPath = destDir + retinaDestName
    
    var data = {
      destName: destName,
      destPath: destPath,
      retinaDestName: retinaDestName,
      retinaDestPath: retinaDestPath,
      version: Date.now(),
      sprites: []
    }

    var lessTemplate = ""
    var cssTemplate = ""
    var vbTemplate = ""
    for(var f of srcFiles){
      var fpath = srcDir + f;
      if(f.includes(".png")){
        (f.includes(retinaPrefix + ".png"))? src2.push(fpath) : src1.push(fpath)  
      }else if(f.includes(".less.handlebars")){
        var hsource = fs.readFileSync(fpath, "utf8")
        lessTemplate = handlebars.compile(hsource)
      }else if(f.includes(".css.handlebars")){
        var hsource = fs.readFileSync(fpath, "utf8")
        cssTemplate = handlebars.compile(hsource)
      }else if(f.includes(".vb.handlebars")){
        var hsource = fs.readFileSync(fpath, "utf8")
        vbTemplate = handlebars.compile(hsource)
      }
    }

    spritesmith.run({src: src1, padding:2}, function handleResult (err, r) {
      if(err) throw err;
      fs.writeFileSync(destPath, r.image);
      execFile('optipng', [destPath], err => { console.log('→ Build: ' + destPath ) });

      // r.coordinates r.properties
      data.w = r.properties.width+"px"
      data.h = r.properties.height+"px"
      for(var i in r.coordinates){
        data.sprites.push({
          name: path.basename(i,".png"),
          x: -r.coordinates[i]['x']+"px",
          y: -r.coordinates[i]['y']+"px",
          w: r.coordinates[i]['width']+"px",
          h: r.coordinates[i]['height']+"px"
        })
      }
      if(lessTemplate && lessPath){
        var css = lessTemplate(data);
        fs.writeFileSync(lessPath, css);
        console.log('→ Build: ' + lessPath)
      } 
      if(cssTemplate && cssPath){
        var css = cssTemplate(data);
        fs.writeFileSync(cssPath, css);
        console.log('→ Build: ' + cssPath)
      }
      if(vbTemplate && vbPath){
        var css = vbTemplate(data);
        fs.writeFileSync(vbPath, css);
        console.log('→ Build: ' + vbPath)
      }

    });
    spritesmith.run({src: src2, padding: 4}, function handleResult (err, result) {
      if(err) throw err;
      fs.writeFileSync(retinaDestPath, result.image);
      execFile('optipng', [retinaDestPath], err => { console.log('→ Build: ' + retinaDestPath) });
    });
  }

}

module.exports = sprite;