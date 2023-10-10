import roomService from '../service/roomService.js'
import infoService from '../service/infoService.js'

function route(message, commands, client) {
    const [handlerKey, ...rest] = commands

    try{
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
            case 'qs':
            case 'quick-start':
                roomService.quickStart(message, rest, client)
                break
            case 'explain':
                infoService.renderTier(message, rest, client)
                break
            case 'test':
                roomService.test(message, rest, client)
                break
            default:
                message.reply("对不起，我不认识这个指令。")
        }
    }catch(ex){
        console.log(ex.message)
    }

   
}

export default {
    route
}