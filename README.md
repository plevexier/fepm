# fepm
Simple front-end package manager for node.

Not really a package manager, just an util that copies front-end files, installed
using npm and therefore in node_modules, to an output directory.

Here's an example.

Copy it into frontend-package.json:
{
    "output": "dist",
    "packages": [
        {"axios": ["dist/axios.js"]},
        {"bootstrap": ["dist/js/bootstrap.js", "dist/css/bootstrap.css"]},
        {"vue": ["dist/vue.js"]}
    ]
}

Save it in the root of your project and run:
> fepm
