async function getWeaponData() {
    console.log('loading weapon data ...')
    const importedData = await import(`../../data/clean/weapon.json`, { assert: {type: 'json'}})

    return importedData.default
}

export const weaponData = await getWeaponData()