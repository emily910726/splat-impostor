import imageProcessor from './imageProcessingService.js'
import randomiser from './RandomiserService.js'

async function renderTier(message, commands, client) {
    if (commands.length > 0) {
        let tier = randomiser.xTierLax
        switch(commands[0]) {
            case 'strict':
                tier = randomiser.xTierStrict
                break
            case 'lax':
                tier = randomiser.xTierLax
                break
            case 'class':
                tier = randomiser.weaponClassTier
                break
            case 'custom':
                tier = Object.values(randomiser.customTier)
                break
        }

        const img = await imageProcessor.renderTiers(
            tier.map(t => {
                return {
                    description: t.description,
                    weapons: t.weapons.map(i => randomiser.getWeapon(i))
                }
            })
        )
        message.reply({ content: 'Tier:', files: [{ attachment: img }] })
    }
}

export default {
    renderTier
}