var connect = require('connect');
var serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname))
    .listen(25565, () => console.log("\x1b[32mLog server ready"));