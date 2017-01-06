#! /usr/bin/env node

var fs = require("fs-extra");
var path = require("path");

var config_file = "frontend-package.json";
var args = process.argv;

var current_dir = process.cwd();

console.log("current dir: " + current_dir);

if(args.length < 3) {

    if(fs.existsSync(current_dir + path.sep + config_file)) {
        var content = fs.readFileSync(current_dir + path.sep + config_file, "utf8");
        var obj = JSON.parse(content);

        if(!fs.existsSync(current_dir + path.sep + obj.output)) {
            fs.mkdirSync(current_dir + path.sep + obj.output);
        } 

        obj.packages.forEach(function(p) {
            var keys = Object.keys(p);
            var name = keys[0];
            var files = p[name];

            if(!fs.existsSync(path.join(current_dir, obj.output, name))) {
                fs.mkdirSync(path.join(current_dir, obj.output, name));
            }

            files.forEach(function(file) {
                var atoms = file.split(path.sep);
                var filename = atoms[atoms.length - 1];

                console.log("copying: " + name + path.sep + filename + "...");
                var source = path.join(current_dir, "node_modules", name, file);
                var dest = path.join(current_dir, obj.output, name, filename);
                fs.copySync(source, dest);
            });
        });

        console.log("All files copied in: " + path.sep + obj.output);
    } else {
        console.log("Usage: fepm [options]");
        console.log("Options:");
        console.log("init   Only option accepted so far...");    
    }
} else {
    var isGlobal = !!process.env.npm_config_global;

    var option = args[2];
    
    if(option === "init") {

        var dest = "";
        if(isGlobal) {
            console.log("global");
            dest = current_dir + path.sep + config_file;
        } else {
            console.log("local");
            dest = current_dir + path.sep + ".." + path.sep + config_file;
        }

        if(!fs.existsSync(dest)) {
            fs.writeFile(dest, "this is the content", function(err, result) {
                if(err) console.err(err);
                else {
                    console.log("File generated.");
                }
            });
        }        
    } else if(option === "install") {
        if(args.length < 4) {
            console.log("Usage: fepm install <package_name>");
        } else {
            var package_name = args[3];
        }
    }
}