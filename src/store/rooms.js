const rooms = {}

const status = {
    CREATED: 'created',
    ENDED: 'ended',
    STARTED: 'started'
}

const playerType = {
    PLAYER:   'a player    😃',
    IMPOSTOR: 'an impostor 👿',
    CALCULATING: 'Calculating...'
}

const teams = {
    RED: 'left',
    BLUE: 'right'
}

function create(key) {
    rooms[key] = {
        status: status.CREATED,
        teams: {
            left: {},
            right: {}
        }
    }
}

function clearAndSetStatus(key, state) {
    rooms[key] = {
        status: state,
        teams: {
            left: {},
            right: {}
        }
    }
}

export default {
    rooms,
    status,
    playerType,
    teams,
    create,
    clearAndSetStatus
}