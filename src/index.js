import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import imageProcessor from './service/imageProcessingService.js'
dotenv.config();

/**
 * @description This array represents the categories of Events we want available to our Bot.
 * @argument: `IntentsBitField.Flags.Guilds`
 * @satisfies Intents with "Guilds" flags facilitates Server access
 * @argument: `IntentsBitField.Flags.MessageContent`
 * @satisfies "MessageContent" permits your app to receive message content data across the APIs.
 * @see https://discord.com/developers/docs/topics/gateway#message-content-intent
 */
const intentOptions = [
    IntentsBitField.Flags.Guilds,        // <-- server
    IntentsBitField.Flags.GuildMembers,  // <-- members in server
    IntentsBitField.Flags.GuildMessages, // <-- messages in server
    IntentsBitField.Flags.MessageContent // <-- messages content
];

/**
 * @class: `Client` from discord.js
 * @instance: `client` is our Bot instance
 * @argument: must take in an options object with `intents` array, all other properties are optional
 *
 * @method: `.on("event" callback)` for bot event handling
 */
const client = new Client({
    intents: intentOptions
});

/**
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ^^^^^^^^^^ EVENT LISTENERS ^^^^^^^^^^
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */

/**
 * @see https://old.discordjs.dev/#/docs/discord.js/main/general/welcome
 * @description: for BOT API documentation
 */

client.on("ready", (bot) => {
    console.log(`✅ ${bot.options.rest.authPrefix} ${bot.user.tag} is online! Listening to channels:`);
    console.log(JSON.stringify(bot.channels));
});

const state = {};
const status = {
    CREATED: 'created',
    ENDED: 'ended',
    STARTED: 'started'
}
const playerType = {
    PLAYER: 'a player 😃',
    IMPOSTOR: 'an impostor 👿',
    CALCULATING: 'Calculating...'
}

client.on("messageCreate", async (message) => {
    /* this validation disallows bots from responding to each other/themselves, remove at your own risk 💀 */
    if (message.author.bot) return;

    /* message sent in server from any user: */
    // console.log(`Discord message: "${message.content}" from User: ${message.author.username} at ${message.createdAt}`);

    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(message.author));

    /* bot will react to any message sent with this emoji */
    // message.react('🤓');
    // message.reply('hello too', { ephemeral: true });

    let command = message.content.toLowerCase()
    if(command.startsWith('test')) {
        const img = await imageProcessor.renderCard(Array.from({length: 8}, () => Math.floor(Math.random() * 101)))
        message.reply({files: [{attachment: img}]})
    }
    if (command.startsWith('!create')) {
        getRoom(message.channelId, [status.ENDED], (room) => {
            state[message.channelId] = {
                status: status.CREATED,
                teamA: {},
                teamB: {}
            }

            message.reply('Room created.');
        }, () => {
            message.reply('Room has already been created.', { ephemeral: true });
        }, () => {
            state[message.channelId] = {
                status: status.CREATED,
                teamA: {},
                teamB: {}
            }

            message.reply('Room created.');
        });
    } else if (command.startsWith('!joina')) {
        getRoom(message.channelId, [status.CREATED], (room) => {
            delete room.teamB[message.author.id];
            room.teamA[message.author.id] = {
                name: message.author.displayName,
                type: playerType.CALCULATING
            };

            // message.reply('Joined team A.', { ephemeral: true });
        }, (room) => {
            message.reply(`The room has ${room.status}`, { ephemeral: true });
        }, () => {
            message.reply(`Please !create a room first`, { ephemeral: true });
        });
    } else if (command.startsWith('!joinb')) {
        getRoom(message.channelId, [status.CREATED], (room) => {
            delete room.teamA[message.author.id];
            room.teamB[message.author.id] = {
                name: message.author.displayName,
                type: playerType.CALCULATING
            };

            // message.reply('Joined team A.', { ephemeral: true });
        }, (room) => {
            message.reply(`The room has ${room.status}`, { ephemeral: true });
        }, () => {
            message.reply(`Please !create a room first`, { ephemeral: true });
        });
    } else if (command.startsWith('!start')) {
        getRoom(message.channelId, [status.CREATED], (room) => {
            room.status = status.STARTED;

            randomisePlayers(room.teamA);
            randomisePlayers(room.teamB);
            for (const userId in room.teamA) {
                const user = client.users.fetch(userId).then((user) => {
                    user.send(`You are ${room.teamA[userId].type}`);
                });
            }
            for (const userId in room.teamB) {
                const user = client.users.fetch(userId).then((user) => {
                    user.send(`You are ${room.teamB[userId].type}`);
                });
            }

            message.reply('Room has started.');
        }, (room) => {
            message.reply(`Cannot start room that has ${room.status}`, { ephemeral: true });
        }, () => {
            message.reply(`Please !create a room first`, { ephemeral: true });
        });
    } else if (command.startsWith('!end')) {
        getRoom(message.channelId, [status.CREATED, status.STARTED], (room) => {
            message.reply(`
### Team A
${Object.entries(room.teamA).map(([playerId, player]) => {
    return `- ${player.name}: ||${player.type}||`;
}).join('\n')}
### Team B
${Object.entries(room.teamB).map(([playerId, player]) => {
    return `- ${player.name}: ||${player.type}||`;
}).join('\n')}
            `);

            state[message.channelId] = {
                status: status.ENDED,
                teamA: {},
                teamB: {}
            }
        }, (room) => {
            message.reply(`Cannot end room that has ${room.status}`, { ephemeral: true });
        }, () => {
            state[message.channelId] = {
                status: 'CREATED',
                teamA: {},
                teamB: {}
            }

            message.reply('Room ended.');
        });
    }

    console.log(JSON.stringify(state, null, 2));
});

function getRoom(channelId, status, next, noMatch, notFound) {
    let room = state[channelId]
    if (room != undefined) {
        if (status.includes(room.status)) next(room);
        else noMatch(room);
    }
    else notFound();
}

function randomisePlayers(players) {
    const members = Object.keys(players);
    if (members.length <= 0) return;

    const impostorIndex = Math.floor(Math.random() * members.length);
    for (const userId in players) {
        players[userId].type = playerType.PLAYER
    }
    players[members[impostorIndex]].type = playerType.IMPOSTOR;
}

client.login(process.env.TOKEN);