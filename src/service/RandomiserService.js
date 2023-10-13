import { weaponData } from '../store/weapons.js'
import { stagesData, vsModeData } from '../store/stages.js'
import roomStore from '../store/rooms.js'

const weaponMap = weaponData.reduce((a, v) => ({ ...a, [v.id]: v }), {})

const mode = {
    WILD: 'wild',
    X_STRICT: 'x-strict',
    X_LAX: 'x-lax',
    CLASS: 'class',
    CUSTOM: 'custom'
}

function validateCompleteList(description, list) {
    const mapCopy = { ...weaponMap }
    for (const subList of list) {
        for (const weaponId of subList.weapons) {
            delete mapCopy[weaponId]
        }
    }

    if (Object.keys(mapCopy).length > 1) {
        console.error(`${description} is incomplete, missing:`)
        Object.keys(mapCopy).forEach(i => console.log(`- ${mapCopy[i].id} ${mapCopy[i].name}`))
    }

    return list
}

function validateCompleteCustomList(description, list) {
    const mapCopy = { ...weaponMap }
    for (const weaponId of list.b.weapons) {
        delete mapCopy[weaponId]
    }
    
    for (const weaponId of list.m.weapons) {
        delete mapCopy[weaponId]
    }

    for (const weaponId of list.f.weapons) {
        delete mapCopy[weaponId]
    }

    if (Object.keys(mapCopy).length > 1) {
        console.error(`${description} is incomplete, missing:`)
        Object.keys(mapCopy).forEach(i => {
            console.log(`- ${mapCopy[i].id} ${mapCopy[i].name}`)
        } )
    }

    return list
}

const xTierStrict = validateCompleteList('X rank strict weapon matchmaking', [
    {
        description: 'Long-ranged chargers',
        weapons: ['Charger_LongScope_00', 'Charger_NormalScope_00', 'Charger_Long_00', 'Charger_NormalScope_01', 'Charger_Normal_00', 'Charger_Normal_01']
    },
    {
        description: 'Mid-ranged chargers',
        weapons: ['Charger_Pencil_00', 'Charger_Keeper_00', 'Charger_Keeper_01', 'Charger_Light_00', 'Charger_Quick_00']
    },
    {
        description: 'Long-ranged weapons',
        weapons: ['Stringer_Normal_00', 'Stringer_Normal_01', 'Spinner_Downpour_00', 'Spinner_Downpour_01', 'Spinner_Hyper_00', 'Spinner_Standard_00', 'Spinner_Standard_01', 'Spinner_HyperShort_00']
    },
    {
        description: 'Mid-ranged weapons',
        weapons: ['Shooter_Long_00', 'Shooter_Long_01', 'Shooter_Flash_00', 'Shooter_Heavy_00', 'Shooter_Heavy_01', 'Spinner_Serein_00', 'Maneuver_Dual_00', 'Maneuver_Dual_01', 'Shooter_Expert_00',
        'Shooter_Expert_01', 'Shooter_TripleMiddle_00', 'Shooter_TripleMiddle_01', 'Maneuver_Gallon_00', 'Shooter_QuickLong_00', 'Shooter_QuickLong_01', 'Spinner_Quick_00', 'Spinner_Quick_01', 'Stringer_Short_00', ]
    },
    {
        description: 'Short-ranged weapons',
        weapons: ['Maneuver_Stepper_00', 'Maneuver_Stepper_01', 'Shooter_TripleQuick_00', 'Shooter_TripleQuick_01', 'Shooter_Gravity_00', 'Maneuver_Normal_00', 'Shooter_Normal_00', 'Shooter_Normal_01', 'Shooter_Normal_H',
        'Shooter_Short_00', 'Shooter_Short_01', 'Shooter_Blaze_00', 'Shooter_Blaze_01', 'Shooter_QuickMiddle_00', 'Shooter_QuickMiddle_01', 'Shooter_Precision_00', 'Shooter_Precision_01', 'Shooter_First_00', 'Shooter_First_01']
    },
    {
        description: 'Long-ranged blasters and sloshers',
        weapons: ['Slosher_Washtub_00', 'Blaster_LightLong_00', 'Blaster_LightLong_01', 'Blaster_Long_00', 'Blaster_Light_00', 'Blaster_Light_01', 'Blaster_Precision_00', 'Slosher_Bathtub_00', 'Slosher_Bathtub_01']
    },
    {
        description: 'Short-ranged blasters and sloshers',
        weapons: ['Slosher_Double_00', 'Slosher_Launcher_00', 'Slosher_Launcher_01', 'Slosher_Strong_00', 'Slosher_Strong_01', 'Blaster_Middle_00', 'Slosher_Diffusion_00', 'Slosher_Diffusion_01', 'Blaster_LightShort_00',
        'Blaster_LightShort_01', 'Blaster_Short_00', 'Blaster_Short_01', 'Maneuver_Short_00', 'Maneuver_Short_01']
    },
    {
        description: 'Long-ranged rollers, brushes, wipers, and brellas',
        weapons: ['Roller_Heavy_00', 'Roller_Heavy_01', 'Saber_Normal_00', 'Shelter_Wide_00', 'Shelter_Wide_01', 'Roller_Hunter_00', 'Brush_Heavy_00', 'Roller_Wide_00', 'Roller_Wide_01']
    },
    {
        description: 'Short-ranged rollers, brushes, wipers, and brellas',
        weapons: ['Saber_Lite_00', 'Saber_Lite_01', 'Shelter_Normal_00', 'Shelter_Normal_01', 'Brush_Normal_00', 'Roller_Compact_00', 'Roller_Compact_01', 'Brush_Mini_00', 'Brush_Mini_01', 'Roller_Normal_00',
        'Roller_Normal_01', 'Shelter_Compact_00', 'Brush_Normal_01']
    },
])

const xTierLax = validateCompleteList('X rank relaxed weapon matchmaking', [
    {
        description: 'Chargers',
        weapons: [...xTierStrict[0].weapons, ...xTierStrict[1].weapons]
    },
    {
        description: 'Weapons',
        weapons: [...xTierStrict[2].weapons, ...xTierStrict[3].weapons, ...xTierStrict[4].weapons]
    },
    {
        description: 'Blasters and sloshers',
        weapons: [...xTierStrict[5].weapons, ...xTierStrict[6].weapons]
    },
    {
        description: 'Rollers, brushes, wipers, and brellas',
        weapons: [...xTierStrict[7].weapons, ...xTierStrict[8].weapons]
    },
])

const classDescription = [
    'Shooters', 'Semi-autos', 'Rollers &amp; brushes', 'Chargers', 'Sloshers',
    'Splatlings', 'Dualies', 'Brellas', 'Stringers', 'Splatanas'
]
const weaponClassTier = validateCompleteList('Weapon class matchmaking',
    weaponData.reduce((a, v) => {
        const estimatedIdx = v.type/1000
        let idx = Math.floor(estimatedIdx)
        if (estimatedIdx > 0.1) idx++
        a[idx].push(v.id)
        return a
    } ,[[],[],[],[],[],[],[],[],[],[]]).map( (x, i) => {
        return {
            description: classDescription[i],
            weapons: x
        }
    })
)

const customTier = validateCompleteCustomList('custom weapon class', {
    b: {
        description: 'backline',
        weapons: ['Charger_LongScope_00', 'Charger_Long_00', 'Charger_NormalScope_00', 'Charger_NormalScope_01', 'Charger_Normal_00', 'Charger_Normal_01', 'Shooter_Long_00', 'Blaster_LightLong_00', 'Blaster_LightLong_01', 'Slosher_Bathtub_00', 'Slosher_Bathtub_01', 'Slosher_Washtub_00', 'Spinner_Hyper_00', 'Spinner_Downpour_01', 'Spinner_Downpour_00', 'Stringer_Normal_01', 'Stringer_Normal_00', 'Charger_Pencil_00', 'Shooter_Long_01', 'Spinner_Standard_00', 'Spinner_Standard_01']
    },
    m: {
        description: 'midline',
        weapons: ['Charger_Keeper_01', 'Charger_Light_00', 'Charger_Quick_00', 'Roller_Heavy_00', 'Roller_Heavy_01', 'Shooter_Flash_00', 'Shooter_Heavy_00', 'Shooter_Heavy_01', 'Spinner_Serein_00', 'Blaster_Long_00', 'Maneuver_Dual_00', 'Maneuver_Dual_01', 'Shooter_Expert_00', 'Shooter_Expert_01', 'Shooter_TripleMiddle_00', 'Shooter_TripleMiddle_01', 'Spinner_HyperShort_00', 'Blaster_Light_00', 'Blaster_Light_01', 'Blaster_Precision_00', 'Maneuver_Gallon_00', 
        'Shooter_QuickLong_00', 'Shooter_QuickLong_01', 'Slosher_Double_00', 'Shelter_Wide_00', 'Shelter_Wide_01', 'Spinner_Quick_00', 'Spinner_Quick_01', 'Slosher_Launcher_00', 'Slosher_Launcher_01', 'Slosher_Strong_00', 'Slosher_Strong_01', 'Roller_Hunter_00', 'Shooter_TripleQuick_00', 'Shooter_TripleQuick_01', 'Blaster_Middle_00',  'Brush_Heavy_00', 'Roller_Wide_00', 'Roller_Wide_01', 'Shooter_First_00', 'Shooter_First_01', 'Brush_Normal_00', 'Brush_Normal_01', 'Charger_Keeper_00']
    },
    f: {
        description: 'frontline',
        weapons: ['Saber_Normal_00', 'Stringer_Short_00', 'Maneuver_Stepper_00', 'Maneuver_Stepper_01', 'Shooter_TripleQuick_00', 'Shooter_TripleQuick_01', 'Shooter_Gravity_00', 'Maneuver_Normal_00', 'Shooter_Normal_00', 'Shooter_Normal_01', 'Shooter_Gravity_00', 'Saber_Lite_00', 'Saber_Lite_01', 'Maneuver_Normal_00', 'Shelter_Normal_00', 'Shelter_Normal_01', 'Shooter_QuickMiddle_00', 'Shooter_QuickMiddle_01', 'Roller_Normal_00', 'Roller_Normal_01', 'Shelter_Compact_00', 
        'Shooter_Precision_00', 'Shooter_Precision_01', 'Blaster_LightShort_00', 'Blaster_LightShort_01', 'Blaster_Short_00', 'Blaster_Short_01', 'Shooter_Blaze_00', 'Shooter_Blaze_01', 'Slosher_Diffusion_00', 'Slosher_Diffusion_01', 'Maneuver_Short_00', 'Maneuver_Short_01', 'Roller_Compact_00', 'Roller_Compact_01', 'Shooter_Short_00', 'Shooter_Short_01', 'Brush_Mini_00', 'Brush_Mini_01']
    },
})

function randomisePlayers(players) {
    const members = Object.keys(players)
    if (members.length <= 0) return

    const impostorIndex = Math.floor(Math.random() * members.length)
    for (const userId in players) {
        players[userId].type = roomStore.playerType.PLAYER
    }
    players[members[impostorIndex]].type = roomStore.playerType.IMPOSTOR
}

function randomisePlayerWeapon(players) {
    const members = [...Object.keys(players), null, null, null, null].slice(0, 4)
    if (members.length <= 0) return []

    return members.map(playerId => {
        if (!playerId) {
            return null
        }
        const weaponIdx = Math.floor(Math.random() * weaponData.length)
        return {
            player: players[playerId],
            weapon: weaponData[weaponIdx]
        }
    })
}

function randomisePlayerWeaponByTier(players, tiers) {
    const members = [...Object.keys(players), null, null, null, null].slice(0, 4)
    if (members.length <= 0) return []

    return members.map((playerId, i) => {
        if (!playerId) {
            return null
        }

        const weaponId = tiers[i][Math.floor(Math.random() * tiers[i].length)]
        
        return {
            player: players[playerId],
            weapon: getWeapon(weaponId)
        }
    })
}

function getWeapon(idx) {
    return weaponMap[idx]
}

function randomiseTeamWeaponByTier(teams, tier) {
    const randomisedTiers = [1, 2, 3, 4].map(x => {
        const weaponIdx = Math.floor(Math.random() * weaponData.length)
        let left = weaponIdx
        for (const subTier of tier) {
            left -= subTier.weapons.length
            if (left <= 0) return subTier.weapons
        }

        return tier[tier.length - 1].weapons
    })

    return [
        ...randomisePlayerWeaponByTier(teams.left, randomisedTiers),
        ...randomisePlayerWeaponByTier(teams.right, randomisedTiers)
    ]
}

function randomisePlayerWeaponByCustomRule(players, tiers, details) {
    const members = [...Object.keys(players), null, null, null, null].slice(0, 4)
    if (members.length <= 0) return []

    const randomisedDetails = details.split('').sort((a, b) => 0.5 - Math.random())
    return members.map((playerId, i) => {
        if (!playerId) {
            return null
        }

        const selectedTier = tiers[randomisedDetails[i]]
        const weaponId = selectedTier.weapons[Math.floor(Math.random() * selectedTier.weapons.length)]
        
        return {
            player: players[playerId],
            weapon: getWeapon(weaponId)
        }
    })
}

function randomiseByCustomRule(teams, tier, details) {
    return [
        ...randomisePlayerWeaponByCustomRule(teams.left, tier, details),
        ...randomisePlayerWeaponByCustomRule(teams.right, tier, details)
    ]
}

function randomiseTeamWeapon(teams) {
    return [
        ...randomisePlayerWeapon(teams.left),
        ...randomisePlayerWeapon(teams.right)
    ]
}

function randomiseImpostor(teams) {
    randomisePlayers(teams.left)
    randomisePlayers(teams.right)
}

function randomise(teams, selectedMode, details) {
    switch (selectedMode) {
        case mode.X_STRICT:
            return randomiseTeamWeaponByTier(teams, xTierStrict)
        case mode.X_LAX:
            return randomiseTeamWeaponByTier(teams, xTierLax)
        case mode.CLASS:
            return randomiseTeamWeaponByTier(teams, weaponClassTier)
        case mode.CUSTOM:
            return randomiseByCustomRule(teams, customTier, details) // todo: validation
        case mode.WILD:
            return randomiseTeamWeapon(teams)
    }
}

function randomiseStage() {
    const stageIdx = Math.floor(Math.random() * stagesData.length)

    return `./data/clean/images/stages/${stagesData[stageIdx].id}.png`
}

function randomiseMode() {
    const modeIdx = Math.floor(Math.random() * vsModeData.length)

    return `./data/clean/images/vsmode/${vsModeData[modeIdx]}.png`
}

export default {
    randomiseTeamWeaponByTier,
    randomiseTeamWeapon,
    randomiseImpostor,
    randomise,
    randomiseStage,
    randomiseMode,
    getWeapon,
    xTierLax,
    xTierStrict,
    weaponClassTier,
    customTier,
    mode
}
