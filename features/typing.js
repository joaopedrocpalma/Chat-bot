/**
 * This module controlls all the the users inputs and responds accordingly
 * Controls queries and handles commands
 */
const { BotkitConversation } = require("botkit");

module.exports = function(controller) {
    // Converstation declarations
    let help = new BotkitConversation('helping', controller);   // Each conversation is created by using this call
    let dialog = new BotkitConversation('talking', controller);
    let search = new BotkitConversation('searching', controller);
    let farewell = new BotkitConversation('farewells', controller);

    // Movie search dialog
    search.addMessage('This is the movie searcher, please answer the questions accordingly.');  // When the user asks for a movie query, the "search" conversation is activated

    search.addMessage({
        text: 'Sorry I did not understand!',
        action: 'default',
    },'bad_response');

    // Filter questions
    search.ask('What kind of movie genre do you prefer?', async(response, convo, bot) => [
        {
            pattern: 'comedy',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('year');
            },
        },
        {
            default: true,
            handler: async function(response, convo, bot) {
                convo.addMessage('Sorry I didnt understand that, could you please repeat?');
                convo.repeat();
            },
        },

    ], 'genre');

    search.ask('From which year?', async(response, convo, bot) => [ // I am using .ask() to save the inputs into the variables, in this case, 'year' is the variable
        {
            pattern: '1990',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('rQ1');
            },

            default: true,
            handler: async function(response, convo, bot) {
                convo.addMessage('Sorry I didnt understand that, could you please repeat?');
                convo.repeat();
            },
        }, 
    ], 'year');

    // Finalizing questions
    search.addQuestion('Do you want to specify a rating score?', [  // To add a rating
        {
            pattern: 'yes',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('scoreQ');                
            },
        },
        {
            pattern: 'no',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('final');
            },
        },
        {
                default: true,
                handler: async function(response, convo, bot) {
                    await convo.gotoThread('bad_response');
            },
        }
    ], 'rQ1');

    search.addQuestion('What is the rating?', async(response, convo, bot) => [
        {
            handler: async function(response, convo, bot) {
                await convo.gotoThread('final');
            },
        }
    ], 'score', 'scoreQ');

    search.addQuestion('How about this movie?', [   // To finalize the query or make a new request
        {
            pattern: 'yes',
            handler: async function(response, convo, bot) {
                // Ends the conversation  
                search.addMessage('Hope you enjoy!');         
            },
        },
        {
            pattern: 'no',
            handler: async function(response, convo, bot) {
                convo.repeat();
            },
        },
        {
                default: true,
                handler: async function(response, convo, bot) {
                    await convo.gotoThread('bad_response');
            },
        }
    ], 'fq1', 'final');
    
    
    // Help dialog
    help.addMessage('Welcome to the help page, use these commands to guide through:<br>!random - for a random movie suggestion<br>!fact - for a fun movie fact<br>!');

    help.addMessage('insert movie recomendation here', 'random');

    help.addMessage('insert fact here', 'fact');

    help.addMessage({
        text: 'Sorry I did not understand.',
        action: 'default',
    },'bad_response');

    help.addQuestion('Which option will you choose?', [
        {
            pattern: '!random',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('random');
            },
        },
        {
            pattern: '!fact',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('fact');
            },
        },
        {
            default: true,
            handler: async function(response, convo, bot) {
                await convo.gotoThread('bad_response');
            },
        }
    ]);

    
    // Normal dialog
    dialog.addMessage('I am great! Thanks for asking.', 'ans1');

    dialog.addMessage('Good to know you are doing great!', 'ans2');

    dialog.addMessage('What can I do for you today? Type !help for a list of commands', 'ans1');
    dialog.addMessage('What can I do for you today? Type !help for a list of commands', 'ans2');

    dialog.addMessage({
        text: 'Sorry I did not understand.',
        action: 'default',
    },'bad_response');

    dialog.addQuestion('Hello! I am Movify, how are you?', [
        {
            pattern: 'how are you?',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('ans1');
            },
        },
        {
            pattern: 'good',
            handler: async function(response, convo, bot) {
                await convo.gotoThread('ans2');
            },
        },
        {
            default: true,
            handler: async function(response, convo, bot) {
                await convo.gotoThread('bad_response');
            },
        }
    ]);

    // Goodbyes response
    farewell.addMessage('Goodbye! Thanks for talking to me today!');


    // Adding the dialogs to the main dialog controller
    controller.addDialog(help);
    controller.addDialog(dialog);
    controller.addDialog(search);
    controller.addDialog(farewell);


    // Dialog listeners
        // Listens to user input and begins a dialog if a word matches any of the bellow
    controller.hears('help', 'message,direct_message', async (bot, message) => {   // When the bot hears the users input and detects that its a match
        await bot.beginDialog('helping');       // Calls the 'helping' conversation and begins a thread in the help conversation
    });

    controller.hears('hello','message,direct_message', async(bot, message) => {
        await bot.beginDialog('talking');
    });

    controller.hears('movie', 'message,direct_message',async(bot, message) => {
        await bot.beginDialog('searching');
    });

    controller.hears('bye','message,direct_message', async(bot, message) => {
        await bot.beginDialog('farewells');
    });

    //-----------------------------------------------------------
};