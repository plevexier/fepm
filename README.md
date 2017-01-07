# fepm
Simple front-end file manager for node.

It can be used with front-end files installed using npm, as a bower replacement.

Install it by:
> npm install fepm -g

Check the frontend-package-example.json file for an example on how to setup multiple
environments.

Here's a quick explanation of some of the properties:

```
/output
```
This is the output directory for all the environments.

```
/environments/name and /environments/default
```

name: name of the environment, should be the same as the environment 
variable ENV. default: if 
```
default = true
```
this environment will be used even if not ENV variable is set.

```
/environments/configuration/packages
```
Here, we list all the packages we want to process. The "name" here will be 
used as output directory for the package. So if:
```
/output = "dist"
``` 
and 
```
name = "jquery"
``` 
all the "files" listed in this package will go into:
```
./dist/jquery.
```

Note the property "outputName" for each file will be used as destination
name. So in above example, if 
```
outputName="jquery.js"
```
we will have the "source" file copied in: 
```
./dist/jquery/jquery.js
```

Action is not implemented yet.

Note, in order to run it:
>fepm
will execute using the frontend-package.json in your current directory.

Or you can do:
>fepm filename.json
if you have multiple files for example.