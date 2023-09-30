module.exports = {
    entry:{
        server: "index.js"
    },
    output:{
        path: path.join(__dirname,"dist"),
        filename: "bundle.js",
    },
     target: "node",
     node: {
        __dirname : false,
        __filename : false,

     },
     externals:[webpackNodeExternals()],
    
}