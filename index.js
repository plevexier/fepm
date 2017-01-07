#! /usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var _ = require("lodash");

var config_file = "frontend-package.json";
var args = process.argv;

var current_dir = process.cwd();
console.log("current dir: " + current_dir);

if(args.length == 2) {
    // no args
    if(fs.existsSync(current_dir + path.sep + config_file)) {
        executeConfig(current_dir + path.sep + config_file)
    } else {
        console.log("Usage: fepm [options]");
        console.log("Options:");
        console.log("init   Only option accepted so far...");    
    }    

} else if(args.length > 2) {
    // 1 arg, can be command or config file
    var option = args[2];
    
    if(option === "init" || option === "help") {
        // it's a command
        executeCommand(option, args.slice(2));
    } else {
        // must be a config file
        try {
            executeConfig(option);
        } catch(ex) {
            console.error(ex);
        }
    }
}

function executeCommand(command, params) {

    if(command === "init") {
        var dest = current_dir + path.sep + config_file;

        if(!fs.existsSync(dest)) {
            fs.writeFile(dest, "this is the content", function(err, result) {
                if(err) console.err(err);
                else {
                    console.log("File generated.");
                }
            });
        }
    }

}

function executeConfig(file) {

    var envValue = process.env.NODE_ENV;
    var content = fs.readFileSync(file, "utf8");
    var obj = JSON.parse(content);

    var config = null;
    if(envValue) {
        config = _.find(obj.environments, {"name": envValue});
    } else {
        config = _.find(obj.environments, {"default": true});
    }

    var configuration = null;
    if(!config) {
        throw new Error("no environment 'ENV' set and no default environment in: " + file);
    } else {
        console.log("current environment: " + config.name);
        configuration = config.configuration;
    }

    var outputDir = obj.output;
    if(!fs.existsSync(current_dir + path.sep + outputDir)) {
        fs.mkdirSync(current_dir + path.sep + outputDir);
    } 

    configuration.packages.forEach(function(p) {

        var packageName = p.name;
        console.log("processing package: " + packageName);

        var files = p.files;

        // we create the package packageName
        if(!fs.existsSync(path.join(current_dir, outputDir, packageName))) {
            fs.mkdirSync(path.join(current_dir, outputDir, packageName));
        }

        files.forEach(function(file) {

            var filename = file.outputName;
            var source = file.source;
            var destination = file.destination || "";
            var action = file.action || "";

            var outputFile = path.join(outputDir, packageName, destination, filename);
            console.log("\tcopying: " + outputFile + "...");
            var src = path.join(current_dir, source);
            fs.copySync(src, outputFile);
        });
    });

    console.log("All files copied in: " + path.sep + obj.output);    

}