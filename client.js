// Importing gRPC module
const grpc = require('@grpc/grpc-js'); 
// Importing proto loader
const protoLoader = require('@grpc/proto-loader'); 
// Importing readline module for user input
const readline = require('readline'); 

// Creating readline interface for user input/output
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
});

// Loading protocol buffer definition
const packageDefinition = protoLoader.loadSync('NoRobbery.proto', {}); 
// Loading gRPC package definition
const NoRobberyProto = grpc.loadPackageDefinition(packageDefinition).NoRobbery; 

// Creating gRPC client
const client = new NoRobberyProto.NoRobbery('localhost:50051', grpc.credentials.createInsecure());

// Function to prompt user input
function askQuestion(query) { 
    return new Promise(resolve => rl.question(query, resolve));
}




main();