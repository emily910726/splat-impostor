import Sharp from 'sharp'
import { mkdir, writeFile, copyFile } from 'node:fs/promises'

const LANGUAGE = 'USen'
const VERSION = '500'

const languageIndexRegex = /Work\/Gyml\/(\w+).+/

async function getLocalisation() {
    const importedData = await import(`../../data/raw/splat3/data/language/${LANGUAGE}_full.json`, { assert: {type: 'json'}})
    const rawData = importedData.default

    return {
        weaponName: rawData['CommonMsg/Weapon/WeaponName_Main'],
        subName: rawData['CommonMsg/Weapon/WeaponName_Sub'],
        specialName: rawData['CommonMsg/Weapon/WeaponName_Special'],
    }
}

async function getRawWeaponData() {
    const importedData = await import(`../../data/raw/splat3/data/mush/${VERSION}/WeaponInfoMain.json`, { assert: {type: 'json'}})
    const validWeapons = importedData.default.filter(weapon => weapon.Id < 10000)
    
    return validWeapons
}

function enrichWeapondata(rawWeaponData, localisation) {
    return rawWeaponData.map(weapon => {
        const subId = weapon.SubWeapon.match(languageIndexRegex)[1]
        const specialId = weapon.SpecialWeapon.match(languageIndexRegex)[1]
        return {
            name: localisation.weaponName[weapon.__RowId],
            sub: localisation.subName[subId],
            special: localisation.specialName[specialId],
            range: weapon.Range,
            type: weapon.MatchingId,
            id: weapon.__RowId,
            subId: subId,
            specialId: specialId,
            weaponImagePath: `./data/clean/images/weapons/${weapon.__RowId}.png`,
            subImagePath: `./data/clean/images/subspe/${subId}.png`,
            specialImagePath: `./data/clean/images/subspe/${specialId}.png`,
        }
    })
}

async function extract() {
    const rawWeapons = await getRawWeaponData()
    const texts = await getLocalisation()
    const weaponData = enrichWeapondata(rawWeapons, texts)

    weaponData.sort((a, b) => b.range - a.range)
    try {
        await mkdir('./data/clean/images/weapons', { recursive: true })
        await mkdir('./data/clean/images/subspe', { recursive: true })
        await copyFile(
            `./data/raw/vs.jpg`,
            `./data/clean/images/vs.jpg`
        )
    } catch(e) {}
    await writeFile('./data/clean/weapon.json', JSON.stringify(weaponData, null, 2))
    weaponData.map(async weapon => {
        await copyFile(
            `./data/raw/splat3/images/weapon_flat/Path_Wst_${weapon.id}.png`,
            `./data/clean/images/weapons/${weapon.id}.png`
        )
        await copyFile(
            `./data/raw/splat3/images/subspe/Wsb_${weapon.subId}00.png`,
            `./data/clean/images/subspe/${weapon.subId}.png`
        )
        await copyFile(
            `./data/raw/splat3/images/subspe/Wsp_${weapon.specialId}00.png`,
            `./data/clean/images/subspe/${weapon.specialId}.png`
        )
    })
}

await extract()