// Importing gRPC module
const grpc = require('@grpc/grpc-js');
// Importing proto loader
const protoLoader = require('@grpc/proto-loader');

// Loading protocol buffer definition
const packageDefinition = protoLoader.loadSync('NoRobbery.proto', {});
// Loading gRPC package definition
const NoRobberyProto = grpc.loadPackageDefinition(packageDefinition).NoRobbery;

// Creating gRPC server
const server = new grpc.Server();




// Binding and starting the server
server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    server.start();
    console.log(`Server running at http://127.0.0.1:${port}`);
    console.log(`
    //////////////////////////////////////////////////
    /////             No Robbery!                ///// 
    //////////////////////////////////////////////////
`);
    console.log(`
  ╭──────────────────────────────────────────────────╮
  │    Welcome to Your Smart Security System!        │
  │                                                  │
  │    Protect Your Home with Intelligent Features   │
  │          and Deter Potential Intruders.          │
  ╰──────────────────────────────────────────────────╯
`);
});