
import Sharp from 'sharp'

const BG_COLOR = ['#89FBED', '#FA89F3', '#FAE389']
const FG_COLOR = '#99552E'
const TEXT_COLOR = '#ffffff'

function getBackground(width, height, opacity = 0, fill = BG_COLOR[0]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="${fill}" fill-opacity="${opacity}"/></svg>`

    return Buffer.from(svg)
}

async function getWeaponImage(path, side) {
    return await Sharp(path)
        .resize(side, side)
        .toBuffer()
}

function getText(text, color) {
    return {
        text: { 
            text: `<span background="#00FF0001" foreground="${color}">${text}</span>`,
            width: 144,
            height: 16,
            rgba: true
        }
    }
}

async function getPanelComposite(weapon) {
    const panelBackground = getBackground(160, 64)
    return await Sharp(panelBackground)
    .composite([
        { input: await getWeaponImage(weapon.weaponImagePath, 64), top: 0, left: 8 },
        { input: await getWeaponImage(weapon.subImagePath, 32), top: 32, left: 64+8 },
        { input: await getWeaponImage(weapon.specialImagePath, 32), top: 32, left: 64+8+32+8 }
    ])
    .png()
    .toBuffer()
}

export default {
    renderCard: async function(playerWeaponList, stagePath, modePath) {
        let panels = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                const idx = (4 * j) + i
                if (playerWeaponList[idx]) {
                    const verticalSpacing = (88 * i) + 20
                    const horizontalSpacing = j * 500
                    panels.push(
                        { input: await getPanelComposite(playerWeaponList[idx].weapon), top: verticalSpacing, left: horizontalSpacing + 32 }
                    )
                    panels.push(
                        { input: getText(playerWeaponList[idx].player.name, FG_COLOR), top: verticalSpacing + 64, left: horizontalSpacing + 32 }
                    )
                }
            }
        }

        const height = 400
        const width = 710
        const padding = 20
        const overlay = { input: getBackground(width - (2 * padding), height - (2 * padding), 0.6), top: padding, left: padding }
        const mode = { input: await getWeaponImage(modePath, 96), top: 152, left: 312 }
        return await Sharp(stagePath)
            .composite([
                overlay,
                mode,
                ...panels
            ])
            .resize(width, height)
            .png()
            .toBuffer()
    },
    renderTiers: async function(tier) {
        const sidePanelWidth = 150
        const side = 32
        const opacity = 0.6
        const width = (side * 8) + sidePanelWidth
        let bgIdx = 0
        let height = 0
        let panels = [{
            input: await getBackground(width, side, opacity, BG_COLOR[bgIdx]), top: 0, left: 0
        }]
        let offsetY = 0
        for (let subTier of tier) {
            let offsetX = sidePanelWidth
            panels.push({ input: getText(subTier.description, TEXT_COLOR), top: offsetY + 8, left:8 })
            for (let weapon of subTier.weapons) {
                panels.push(
                    { input: await getWeaponImage(weapon.weaponImagePath, side), top: offsetY, left: offsetX }
                )
                offsetX += side
                if (offsetX > width) {
                    offsetX = sidePanelWidth
                    offsetY += side
                    panels.push({
                        input: await getBackground(width, side, opacity, BG_COLOR[bgIdx]), top: offsetY, left: 0
                    })
                }
            }
            bgIdx = (bgIdx + 1) % BG_COLOR.length
            if (offsetX > sidePanelWidth) {
                offsetY += side
                panels.push({
                    input: await getBackground(width, side, opacity, BG_COLOR[bgIdx]), top: offsetY, left: 0
                })
            }
            height = offsetY
        }

        const panelBackground = getBackground(width, height)
        return await Sharp(panelBackground)
            .composite(panels)
            .resize(width, height)
            .png()
            .toBuffer()
    }
}