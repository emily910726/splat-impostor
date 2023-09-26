
import Sharp from 'sharp'

const BG_COLOR = 'SlateBlue'
const FG_COLOR = 'white'

async function getWeaponData() {
    const importedData = await import(`../../data/clean/weapon.json`, { assert: {type: 'json'}})

    return importedData.default
}

const weaponData = await getWeaponData()

function getBackground(width, height) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="${BG_COLOR}" fill-opacity="0"/></svg>`

    return Buffer.from(svg)
}

async function getWeaponImage(path, side) {
    return await Sharp(path)
        .resize(side, side)
        .toBuffer()
}

function getPlayerName(text) {
    return {
        text: { 
            text: `<span background="#00FF0001" foreground="${FG_COLOR}">${text}</span>`,
            width: 144,
            height: 16, 
            rgba: true
        }
    }
}

async function getPanelComposite(idx) {
    const panelBackground = getBackground(160, 64)
    return await Sharp(panelBackground)
    .composite([
        { input: await getWeaponImage(weaponData[idx].weaponImagePath, 64), top: 0, left: 8 },
        { input: await getWeaponImage(weaponData[idx].subImagePath, 32), top: 32, left: 64+8 },
        { input: await getWeaponImage(weaponData[idx].specialImagePath, 32), top: 32, left: 64+8+32+8 }
    ])
    .png()
    .toBuffer()
}

export default {
    renderCard: async function(weaponIndexes) {
        let panels = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                const verticalSpacing = 104 * i
                const horizontalSpacing = j * 400
                panels.push(
                    { input: await getPanelComposite(weaponIndexes[2*i + j]), top: verticalSpacing, left: horizontalSpacing + 32 }
                )
                panels.push(
                    { input: getPlayerName('hello'), top: verticalSpacing + 64, left: horizontalSpacing + 32 }
                )
            }
        }

        return await Sharp('./data/clean/images/vs.jpg')
            .composite(panels)
            .resize(600, 400)
            .png()
            .toBuffer()
    }
}