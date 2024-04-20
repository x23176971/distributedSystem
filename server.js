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

const rooms = ['living room', 'bedroom', 'kitchen', 'bathroom'];

// Adding services to the server
server.addService(NoRobberyProto.NoRobbery.service, {
    // Service method to set music timer
    SetTimeMusic: (call, callback) => {
        // Extracting desired time from the request
        const desiredTime = call.request.time;
        // Logic to set the time, e.g., interact with the security system
        // For now, let's just return a confirmation message
        const message = `Time set to ${desiredTime} minutes\n`;
        // Sending response back to the client
        callback(null, { message });
        console.log(`The client has set the time to ${desiredTime}\n`);
    },

    // Service method to activate alarm
    activateAlarm: (call) => {
        console.log("*****Alarm will now turn on for 10 seconds...*****\n");
        // Sending initial message to the client
        call.write({ message: 'Alarm activated successfully.\n' });

        // Simulating alarm activation process
        let countdown = 10;
        let bipNumber = 1;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                call.write({ message: 'Bip ' + bipNumber });
                bipNumber++;
                console.log(`Countdown: ${countdown} seconds remaining...`);
                countdown--;
            } else {
                clearInterval(countdownInterval);
                console.log("Alarm deactivated.\n");
                // Ending the call
                call.end();
            }
        }, 1000); // Countdown interval of 1 second
    },

});

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