const http = require('http');

const port = 4000;

//## imported our app
const app = require('../Blog App/app');

//## By using http library i have create a server 
const server = http.createServer(app);

//## listening the server
server.listen(port,()=>{
    console.log(`Blog App server is Connected on ${port}`);
});