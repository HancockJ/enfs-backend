import express from 'express';
const genex = require('genex');
const {ethers} = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d163401424514af5bd48d03741865114');

const indexRouter = express.Router();

indexRouter.get('/', (req,res) => {
    res.send('You have queried the backend ENFS server')
})

indexRouter.post('/checkNames', (req,res) => {
    let names = getMatches(req.body.regex);
    checkNameList(names).then(response => {
        console.log(Object.fromEntries(response))
        res.send(Object.fromEntries(response))
    })
})

function getMatches(regexString) {
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
    for(let i in nameList){
        nameMap.set(nameList[i], await provider.resolveName(nameList[i] + ".eth"));
    }
    return nameMap;
}

export default indexRouter;