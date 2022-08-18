const {ethers} = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d163401424514af5bd48d03741865114');
const { ENS } = require('@ensdomains/ensjs')
const ENSInstance = new ENS()
const genex = require("genex");

function getNameList(regexString) {
    try {
        const pattern = genex(regexString);
        if(pattern.count() < 1000){
            let matches = pattern.generate();
            return matches.filter(word => /^[A-Za-z\d]*$/.test(word));
        }
    } catch (error) {
        return([regexString])
    }
}

async function checkNameList(nameList) {
    const nameMap = new Map();
    await ENSInstance.setProvider(provider)
    const promiseMap = nameList.map(name => ENSInstance.getOwner(name + ".eth"));
    let values = await Promise.all(promiseMap)
    for(let i in values){
        if(values[i] != null){
            nameMap.set(nameList[i], values[i].owner);
        }else{
            nameMap.set(nameList[i], null);
        }
    }
    return nameMap;
}

module.exports = async function (regexString) {
    const names = getNameList(regexString);
    return await checkNameList(names);
};
