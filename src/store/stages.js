async function getStagesData() {
    console.log('loading stage data ...')
    const importedData = await import(`../../data/clean/stages.json`, { assert: {type: 'json'}})

    return importedData.default
}

export const stagesData = await getStagesData()
export const vsModeData = [
    'clams', 'zones', 'tc', 'rainmaker'
]