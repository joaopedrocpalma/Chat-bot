/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { BotkitConversation } = require("botkit");

module.exports = function(controller) {

    // Simple phrases for common inputs

    controller.hears(['help', '!help'],'message,direct_message', async(bot, message) => {
        await bot.reply(message, 'Welcome to the help page, use these commands to guide through:<br>!random - for a random movie suggestion<br>!fact - for a fun movie fact');
    });

    /*controller.hears(['how are you?', 'How are you?', 'how are you'],'message,direct_message', async(bot, message) => {
        await bot.reply(message, 'I am great! Thanks for asking.<br> What can I do for you today?');
    });

    // copies input and sends it back
    /*controller.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, `Echo: ${ message.text }`);
    });*/   


    /*let convo = new BotkitConversation(search_movie, controller);
        convo.ask('What genre are you looking for?', [], 'genre');
        convo.ask('From which year?', [], 'year');
        convo.ask('Any specific actors?', [], 'actor');
        convo.after(async(results, bot) => {

     // handle results.name, results.age, results.color

    });
    controller.addDialog(convo);*/
}
