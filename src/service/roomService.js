import { rooms, status, playerType } from '../store/rooms.js'
import imageProcessor from './imageProcessingService.js'

function getRoom(channelId, status, next, noMatch, notFound) {
    let room = rooms[channelId]
    if (room != undefined) {
        if (status.includes(room.status)) next(room)
        else noMatch(room)
    }
    else notFound()
}

function randomisePlayers(players) {
    const members = Object.keys(players)
    if (members.length <= 0) return

    const impostorIndex = Math.floor(Math.random() * members.length)
    for (const userId in players) {
        players[userId].type = playerType.PLAYER
    }
    players[members[impostorIndex]].type = playerType.IMPOSTOR
}

function createRoom(message, commands) {
    getRoom(message.channelId, [status.ENDED], (room) => {
        rooms[message.channelId] = {
            status: status.CREATED,
            teamA: {},
            teamB: {}
        }

        message.reply('Room created.')
    }, () => {
        message.reply('Room has already been created.', { ephemeral: true })
    }, () => {
        rooms[message.channelId] = {
            status: status.CREATED,
            teamA: {},
            teamB: {}
        }

        message.reply('Room created.')
    })
}

function joinRoom(message, commands) {
    getRoom(message.channelId, [status.CREATED], (room) => {
        delete room.teamB[message.author.id]
        room.teamA[message.author.id] = {
            name: message.author.displayName,
            type: playerType.CALCULATING
        }

        // message.reply('Joined team A.', { ephemeral: true })
    }, (room) => {
        message.reply(`The room has ${room.status}`, { ephemeral: true })
    }, () => {
        message.reply(`Please !create a room first`, { ephemeral: true })
    })
}

function startRoom(message, commands, client) {
    getRoom(message.channelId, [status.CREATED], async (room) => {
        room.status = status.STARTED

        randomisePlayers(room.teamA)
        randomisePlayers(room.teamB)
        for (const userId in room.teamA) {
            const user = client.users.fetch(userId).then((user) => {
                user.send(`You are ${room.teamA[userId].type}`)
            })
        }
        for (const userId in room.teamB) {
            const user = client.users.fetch(userId).then((user) => {
                user.send(`You are ${room.teamB[userId].type}`)
            })
        }

        const img = await imageProcessor.renderCard(Array.from({length: 8}, () => Math.floor(Math.random() * 101)))
        message.reply({content: 'Room has started.', files: [{attachment: img}]})
    }, (room) => {
        message.reply(`Cannot start room that has ${room.status}`, { ephemeral: true })
    }, () => {
        message.reply(`Please !create a room first`, { ephemeral: true })
    })
}

function endRoom(message, commands) {
    getRoom(message.channelId, [status.CREATED, status.STARTED], (room) => {
        message.reply(`
### Team A
${Object.entries(room.teamA).map(([playerId, player]) => {
return `- ${player.name}: ||${player.type}||`
}).join('\n')}
### Team B
${Object.entries(room.teamB).map(([playerId, player]) => {
return `- ${player.name}: ||${player.type}||`
}).join('\n')}
        `)

        rooms[message.channelId] = {
            status: status.ENDED,
            teamA: {},
            teamB: {}
        }
    }, (room) => {
        message.reply(`Cannot end room that has ${room.status}`, { ephemeral: true })
    }, () => {
        rooms[message.channelId] = {
            status: 'created',
            teamA: {},
            teamB: {}
        }

        message.reply('Room ended.')
    })
}

export default {
    createRoom,
    joinRoom,
    startRoom,
    endRoom
}