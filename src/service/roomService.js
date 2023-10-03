import roomStore from '../store/rooms.js'
import imageProcessor from './imageProcessingService.js'
import randomiser from './RandomiserService.js'

function getRoom(channelId, status, next, noMatch, notFound) {
    let room = roomStore.rooms[channelId]
    if (room != undefined) {
        if (status.includes(room.status)) next(room)
        else noMatch(room)
    }
    else notFound()
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
        let mode = roomStore.mode.IMPOSTOR
        let isRandom = false
        let randomisationMode = randomiser.mode.WILD
        if (commands.length > 0) {
            if (commands[0] == 'vs') mode = roomStore.mode.VERSUS
            if (commands[0] == 'im') mode = roomStore.mode.IMPOSTOR
        }
        if (commands.length > 1) {
            if (commands[1] == 'random') isRandom = true
        }
        if (commands.length > 2) {
            switch (commands[2]) {
                case 'strict': 
                    randomisationMode = randomiser.mode.X_STRICT
                    break
                case 'lax': 
                    randomisationMode = randomiser.mode.X_LAX
                    break
                case 'class': 
                    randomisationMode = randomiser.mode.CLASS
                    break
            }
        }

        room.status = roomStore.status.STARTED
        room.mode = mode

        if (mode == roomStore.mode.IMPOSTOR) {
            randomiser.randomiseImpostor(room.teams)
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
        }

        if (isRandom) {
            const result = randomiser.randomise(room.teams, randomisationMode)
            const stage = randomiser.randomiseStage()
            const vsMode = randomiser.randomiseMode()
            const img = await imageProcessor.renderCard(result, stage, vsMode)
            message.reply({content: 'Room has started.', files: [{attachment: img}]})
        } else {
            message.reply('Room has started.')
        }
    }, (room) => {
        message.reply(`Cannot start room that has ${room.status}`)
    }, () => {
        message.reply(`Please !create a room first`)
    })
}

function endRoom(message, commands) {
    getRoom(message.channelId, [roomStore.status.CREATED, roomStore.status.STARTED], (room) => {
        if (room.mode == roomStore.mode.IMPOSTOR) {
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
        } else {
            message.reply('Room ended.')
        }

        roomStore.clearAndSetStatus(message.channelId, roomStore.status.ENDED)
    }, (room) => {
        message.reply(`Cannot end room that has ${room.status}`)
    }, () => {
        roomStore.clearAndSetStatus(message.channelId, roomStore.status.ENDED)
        message.reply('Room ended.')
    })
}

async function test(message, commands, client) {
    if (message.author.id != 152819138329444352) return

    const dummyTeams = {
        left: {
            [1]: {
                name: 'player A1',
                type: ''
            },
            [2]: {
                name: 'player A2',
                type: ''
            },
            [3]: {
                name: 'player A3',
                type: ''
            },
            [4]: {
                name: 'player A4',
                type: ''
            },
            [5]: {
                name: 'player A5',
                type: ''
            },
        },
        right: {
            [6]: {
                name: 'player B1',
                type: ''
            },
            [7]: {
                name: 'player B2',
                type: ''
            },
            [8]: {
                name: 'player B3',
                type: ''
            },
            [9]: {
                name: 'player B4',
                type: ''
            },
        }
    }

    const result = randomiser.randomiseTeamWeapon(dummyTeams)
    const img = await imageProcessor.renderCard(result, './data/clean/images/stages/Factory.png', './data/clean/images/vsmode/zones.png')
    message.reply({ content: 'Room has started.', files: [{ attachment: img }] })
}

async function quickStart(message, commands) {
    const dummyTeams = {
        left: {
            [1]: {
                name: 'player A1你好',
                type: ''
            },
            [2]: {
                name: 'player A2',
                type: ''
            },
            [3]: {
                name: 'player A3',
                type: ''
            },
            [4]: {
                name: 'player A4',
                type: ''
            },
            [5]: {
                name: 'player A5',
                type: ''
            },
        },
        right: {
            [6]: {
                name: 'player B1我好',
                type: ''
            },
            [7]: {
                name: 'player B2',
                type: ''
            },
            [8]: {
                name: 'player B3',
                type: ''
            },
            [9]: {
                name: 'player B4',
                type: ''
            },
        }
    }

    let randomisationMode = randomiser.mode.WILD
    if (commands.length > 0) {
        switch (commands[0]) {
            case 'strict': 
                randomisationMode = randomiser.mode.X_STRICT
                break
            case 'lax': 
                randomisationMode = randomiser.mode.X_LAX
                break
            case 'class': 
                randomisationMode = randomiser.mode.CLASS
                break
        }
    }

    const result = randomiser.randomise(dummyTeams, randomisationMode)
    const stage = randomiser.randomiseStage()
    const vsMode = randomiser.randomiseMode()
    const img = await imageProcessor.renderCard(result, stage, vsMode)
    message.reply({content: 'Room has started.', files: [{attachment: img}]})
}

export default {
    createRoom,
    joinRoom,
    startRoom,
    endRoom,
    quickStart,
    test,
}