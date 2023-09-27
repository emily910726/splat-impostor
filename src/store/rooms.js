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

const mode = {
    VERSUS: 'versus',
    IMPOSTOR: 'impostor',
    NONE: 'none'
}

function create(key) {
    rooms[key] = {
        status: status.CREATED,
        teams: {
            left: {},
            right: {}
        },
        mode: mode.NONE
    }
}

function clearAndSetStatus(key, state) {
    rooms[key] = {
        status: state,
        teams: {
            left: {},
            right: {}
        },
        mode: mode.NONE
    }
}

export default {
    rooms,
    status,
    playerType,
    teams,
    mode,
    create,
    clearAndSetStatus
}