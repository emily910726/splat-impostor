import roomService from '../service/roomService.js'

function route(message, commands, client) {
    const [handlerKey, ...rest] = commands

    switch(handlerKey) {
        case 'create': 
            roomService.createRoom(message, commands)
            break
        case 'joina':
            roomService.joinRoom(message, commands)
            break
        case 'joinb':
            roomService.joinRoom(message, commands)
            break
        case 'start':
            roomService.startRoom(message, commands, client)
            break
        case 'end':
            roomService.endRoom(message, commands)
            break
    }
}

export default {
    route
}