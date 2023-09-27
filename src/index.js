import { Client, IntentsBitField } from "discord.js"
import dotenv from "dotenv"
import router from './command-router/commandRouter.js'
dotenv.config()

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
]

/**
 * @class: `Client` from discord.js
 * @instance: `client` is our Bot instance
 * @argument: must take in an options object with `intents` array, all other properties are optional
 *
 * @method: `.on("event" callback)` for bot event handling
 */
const client = new Client({
    intents: intentOptions
})

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
    console.log(`✅ ${bot.options.rest.authPrefix} ${bot.user.tag} is online! Listening to channels:`)
    console.log(JSON.stringify(bot.channels))
})

client.on("messageCreate", async (message) => {
    /* this validation disallows bots from responding to each other/themselves, remove at your own risk 💀 */
    if (message.author.bot) return

    /* message sent in server from any user: */
    // console.log(`Discord message: "${message.content}" from User: ${message.author.username} at ${message.createdAt}`)

    // console.log(JSON.stringify(message))
    // console.log(JSON.stringify(message.author))

    /* bot will react to any message sent with this emoji */
    // message.react('🤓')
    // message.reply('hello too', { ephemeral: true })

    let command = message.content.toLowerCase()
    if (command.startsWith(process.env.TRIGGER)) {
        const commands = command.substring(1).split(/\s+/)
        router.route(message, commands, client)
    }
})

client.login(process.env.TOKEN)