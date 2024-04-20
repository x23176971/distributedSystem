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

// Array of room names
const rooms = ['living room', 'bedroom', 'kitchen', 'bathroom']; 

//Main function
async function main() {
    // Displaying welcome message
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

    // Displaying the initial menu
    console.log('\nSelect an option:');
    console.log('1: Set Music Timer to deter intruders');
    console.log('2: Activate Alarm to scare away burglars');
    console.log('3: Control Lights remotely to simulate presence');
    console.log('4: Check motion detection in each room');

    // Prompting the user for input
    const choice = await askQuestion('\nEnter your choice: ');
    switch (choice) {
        case '1':
            // Prompting the user to enter the desired music duration
            let time = 0;
            while (true) {
                try {
                    time = parseFloat(await askQuestion('Enter the desired music duration (in minutes): '));
                    if (!isNaN(time)) {
                        // Break the loop if a valid number is entered
                        break; 
                    } else {
                        console.log('Please enter a valid number.');
                    }
                } catch (error) {
                    console.log('Please enter a correct number:', error);
                }
            }
            // Creating a request object to set the music timer
            const request = { time };
            // Calling the gRPC method to set the music timer
            client.SetTimeMusic(request, (error, response) => {
                if (error) {
                    // Handling error if occurred during setting the music timer
                    console.error('Error setting music timer:', error);
                } else {
                    // Logging success message if music timer is set successfully
                    console.log('Music timer set successfully:' +response.message);
                    console.log('\nExiting Smart Security System. Goodbye!');
                }
                // Closing the readline interface after the operation is completed
                rl.close(); 
            });
            break;
        case '2':
            // Establishing a stream to activate the alarm
            const alarmStream = client.ActivateAlarm();

            // Listening for data events from the alarm stream
            alarmStream.on('data', (response) => {
                console.log('Alarm activated:', response.message);
            });

            // Handling end event of the alarm stream
            alarmStream.on('end', () => {
                console.log('Alarm process ended.');
                console.log('\nExiting Smart Security System. Goodbye!');
                // Closing the readline interface
                rl.close();
            });

            // Function to trigger the alarm
            async function triggerAlarm() {
                console.log("Activating alarm...");
                alarmStream.write({ trigger: true });
                alarmStream.end();
            }

            // Invoking the function to trigger the alarm
            triggerAlarm();
            break;
        
        default:
            // Informing about invalid choice
            console.log('Invalid choice. Please select a valid option.');
            console.log('\nExiting Smart Security System. Goodbye!');
            // Closing the readline interface
            rl.close();
            break;
    }// End of switch statement
}// End of main function

main();