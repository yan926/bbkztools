var fs           = require("fs")
var watch        = require("watch")
var path         = require("path")
var Connection   = require('ssh2')
var util         = require('util')
var EventEmitter = require('events').EventEmitter
var _auth = require('./auth')

sftp = null;

//==========================
var Transport = function( config ) {
  this.config = config;
  this.initConnection()
}
util.inherits(Transport, EventEmitter);

Transport.prototype.initConnection = function() {
  this.connection = new Connection();

  this.connection.on("error", function() {
    console.log("→ FTP error", arguments);
  });
  this.connection.on("timeout", function() {
    console.log(arguments);
  });
  this.connection.on("close", function() {
    console.log("→ Closed.");
  });
  this.connection.on("end", function() {
    console.log("→ FTP connection closed.");
  });
  this.connection.on("ready", function() {
    // console.log("→ FTP connection ready.");
    return this.connection.sftp(function(err, sftpClient) {
      if (err) {
        console.log("SFTP ERR");
        throw err;
      }
      this.sftp = sftpClient;
      this.emit('ready');
      console.log("→ SFTP connection ready");
    }.bind(this));
  }.bind(this));

  console.log("→ Connecting to " + this.config.username + "@" + this.config.host + ":22");
  this.connection.connect({
    host: this.config.host,
    port: 22,
    username: this.config.username,
    password: this.config.password
  });
};


Transport.prototype.createFile = function(relativeFilePath, data, callback) {
  this.updateFile(relativeFilePath, data, callback)
};
Transport.prototype.updateFile = function(relativeFilePath, data, callback) {
  var pathOnServer;
  pathOnServer = path.join(this.config.path, relativeFilePath);
  console.log("→ updating " + this.config.host + '/' + relativeFilePath);
  this.sftp.writeFile(pathOnServer, data, callback);
};
Transport.prototype.deleteFile = function(relativeFilePath, callback) {
  console.log("→ deleting " + this.config.host + '/' + relativeFilePath);
  this.sftp.unlink(relativeFilePath, callback)
};

Transport.prototype.createDirectory = function(relativeFilePath, callback) {
  console.log("→ creating " + this.config.host + '/' + relativeFilePath);
  this.sftp.mkdir(relativeFilePath, callback)
};
Transport.prototype.deleteDirectory = function(relativeFilePath, callback) {
  console.log("→ deleting " + this.config.host + '/' + relativeFilePath);
  this.sftp.rmdir(relativeFilePath, callback)
};
//==========================


var livesync = {
  init:function(watchPath){
  	this.watchPath = watchPath
  	var auth = _auth.get()
    this.transport = new Transport({
      type: auth['type'],
      host: auth['host'],
      port: auth['port'],
      username: auth['user'],
      password: auth['password'],
      path : auth['remote_path'] + '/' + watchPath
    });
    this.transport.on('ready',this.watching.bind(this));    
  },
  
  watching:function(){
    var ignore = /(\.git\b)/
    // console.log("* Livesync Watching: " + this.watchPath);
    watch.createMonitor(this.watchPath, {
      ignoreDotFiles: true
    }, this.onMonitor.bind(this));
  },
  onMonitor:function(monitor){
    monitor.on('created', this.createFile.bind(this));
    monitor.on('changed', this.updateFile.bind(this));
    monitor.on('removed', this.deleteFile.bind(this));
  },
  createFile:function(filePath, stat){
    var rpath = path.relative(this.watchPath, filePath);
    var err = function(error){
      if(error){ 
        console.log("createFile ERROR ("+rpath+")");
        console.log(error); 
        return; 
      }
    };
    if (stat.isDirectory()){
      this.transport.createDirectory(rpath, err)
    } else {
      this.transport.createFile(rpath, fs.readFileSync(filePath), err)
    }
  },
  updateFile:function(filePath, curr, prev){
    var rpath = path.relative(this.watchPath, filePath)
    this.transport.updateFile(rpath, fs.readFileSync(filePath), function(error) {
      if (error) {
        console.log("updateFile ERROR ("+rpath+")");
        console.log(error);
        return;
      }
      return console.log("Done.");
    })
  },
  deleteFile:function(filePath, stat){
    var rpath = path.relative(this.watchPath, filePath)
    var err = function(error){
      console.log("deleteFile ERROR ("+rpath+")");
      console.log(error);
      return;
    }
    if(stat.isDirectory()){
      this.transport.deleteDirectory(relativeFilePath, err);
    } else {
      this.transport.deleteFile(relativeFilePath, err);
    }
  } 

};

module.exports = livesync;