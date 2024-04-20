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

    // Service method to control lights
    ControlLights: (call) => {
        // Handling incoming data from the client
        call.on('data', (request) => {
            const { room, activate } = request;
            if (activate) {
                console.log(`Turning on the lights for 5 minutes in ${room}...\n`);
                // Logic to activate the lights goes here
            } else {
                console.log(`No action for ${room}\n`);
                // Logic to deactivate the lights goes here
            }
        });

        // Handling end of the call
        call.on('end', () => {
            call.write({ message: 'Lights control stream ended.\n' });
            call.end();
        });
    },
    // Implementation of the MotionDetectionStream RPC method
    MotionDetectionStream: (call) => {
        // Simulated motion detection for each room
        const rooms = ['living room', 'bedroom', 'kitchen', 'bathroom'];
        
        // Loop through each room and simulate motion detection
        rooms.forEach((room, index) => {
            // Simulated motion detection event with increasing delay
            setTimeout(() => {
                // Simulate motion detection with 1/3 chance
                const motionDetected = Math.random() < 0.3;
                // Running motion detection
                console.log("Running motion detection in "+ room);
                // Create message based on motion detection
                const message = motionDetected ? `Motion detected in ${room}!` : `No motion detected in ${room}.`;
                // Send response to the client
                call.write({ message });
            }, (index + 1) * 500); // Increasing delay for each room
        });      
        
        // End the streaming call after 5 seconds
        setTimeout(() => {
            console.log("Motion Detecting Ending\n")
            call.end();
        }, 5000); 
    }
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