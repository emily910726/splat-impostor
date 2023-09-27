import roomService from '../service/roomService.js'

function route(message, commands, client) {
    const [handlerKey, ...rest] = commands

    switch(handlerKey) {
        case 'create': 
            roomService.createRoom(message, rest)
            break
        case 'join':
            roomService.joinRoom(message, rest)
            break
        case 'start':
            roomService.startRoom(message, rest, client)
            break
        case 'end':
            roomService.endRoom(message, rest)
            break
        case 'test':
            roomService.test(message, rest, client)
            break
        // todo: default manual
    }
}

export default {
    route
}