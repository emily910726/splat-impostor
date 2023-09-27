import roomStore from '../store/rooms.js'
import imageProcessor from './imageProcessingService.js'

function getRoom(channelId, status, next, noMatch, notFound) {
    let room = roomStore.rooms[channelId]
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
        players[userId].type = roomStore.playerType.PLAYER
    }
    players[members[impostorIndex]].type = roomStore.playerType.IMPOSTOR
}

function createRoom(message, commands) {
    getRoom(message.channelId, [roomStore.status.ENDED], (room) => {
        roomStore.create(message.channelId)
        message.reply('Room created.')
    }, () => {
        message.reply('Room has already been created.')
    }, () => {
        roomStore.create(message.channelId)
        message.reply('Room created.')
    })
}

function joinRoom(message, commands) {
    getRoom(message.channelId, [roomStore.status.CREATED], (room) => {
        if (commands.length >= 1) {
            let side = undefined
            let otherSide = undefined
            switch(commands[0]) {
                case 'a':
                case 'left':
                case 'red':
                    side = roomStore.teams.RED
                    otherSide = roomStore.teams.BLUE
                    break
                case 'b':
                case 'right':
                case 'blue':
                    side = roomStore.teams.BLUE
                    otherSide = roomStore.teams.RED
                    break
            }

            if (side !== undefined) {
                delete room.teams[otherSide][message.author.id]
                room.teams[side][message.author.id] = {
                    name: message.author.displayName,
                    type: roomStore.playerType.CALCULATING
                }
            }
        }
    }, (room) => {
        message.reply(`The room has ${room.status}`)
    }, () => {
        message.reply(`Please !create a room first`)
    })
}

function startRoom(message, commands, client) {
    getRoom(message.channelId, [roomStore.status.CREATED], async (room) => {
        room.status = roomStore.status.STARTED

        randomisePlayers(room.teams.left)
        randomisePlayers(room.teams.right)
        for (const userId in room.teams.left) {
            const user = client.users.fetch(userId).then((user) => {
                user.send(`You are ${room.teams.left[userId].type}`)
            })
        }
        for (const userId in room.teams.right) {
            const user = client.users.fetch(userId).then((user) => {
                user.send(`You are ${room.teams.right[userId].type}`)
            })
        }

        const img = await imageProcessor.renderCard(Array.from({length: 8}, () => Math.floor(Math.random() * 101)))
        message.reply({content: 'Room has started.', files: [{attachment: img}]})
    }, (room) => {
        message.reply(`Cannot start room that has ${room.status}`)
    }, () => {
        message.reply(`Please !create a room first`)
    })
}

function endRoom(message, commands) {
    getRoom(message.channelId, [roomStore.status.CREATED, roomStore.status.STARTED], (room) => {
        message.reply(`
### Team A
${Object.entries(room.teams.left).map(([playerId, player]) => {
return `- ${player.name}: ||${player.type}||`
}).join('\n')}
### Team B
${Object.entries(room.teams.right).map(([playerId, player]) => {
return `- ${player.name}: ||${player.type}||`
}).join('\n')}
        `)

        roomStore.clearAndSetStatus(message.channelId, roomStore.status.ENDED)
    }, (room) => {
        message.reply(`Cannot end room that has ${room.status}`)
    }, () => {
        roomStore.clearAndSetStatus(message.channelId, roomStore.status.ENDED)
        message.reply('Room ended.')
    })
}

export default {
    createRoom,
    joinRoom,
    startRoom,
    endRoom
}