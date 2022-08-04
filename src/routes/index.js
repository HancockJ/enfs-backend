import express from 'express';
import { infuraKey } from '../config';
const genex = require('genex');
const {ethers} = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d163401424514af5bd48d03741865114');

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => res.status(200).json({ message: infuraKey }));

indexRouter.get('/search', (req,res) => {
    res.send('You got search')
})


indexRouter.get('/axiosTest', (req,res) => {
    f().then(response => {
        res.send(response)
    })
})

indexRouter.get('/axiosGetTwo', (req,res) => {
    let name = "vitalik"
    provider.resolveName(name + ".eth").then(ens => {
        if(ens === null){
            console.log(name + ".eth is available!");
            res.send(name + ".eth is available!");
        }else{
            console.log(name + ".eth is owned by " + ens);
            res.send(name + ".eth is owned by " + ens)
        }
    })
})

indexRouter.post('/axiosGetTwo', (req,res) => {
    let input = JSON.stringify(req.body)
    // console.log(input)
    let name = JSON.parse(input).name
    checkSingleName(name).then(response => {
        res.send(response)
    })
})

indexRouter.post('/axiosPost', (req,res) => {
    let input = JSON.stringify(req.body)
    // console.log(input)
    let name = JSON.parse(input).name
    checkSingleName(name).then(response => {
        res.send(response)
    })
})

indexRouter.post('/search', (req,res) => {
    let name = req.body.name
   checkSingleName(name).then(response => {
       res.send(String(response));
   })
})

indexRouter.post('/checkNames', (req,res) => {
    let names = getMatches(req.body.regex);
    checkNameList(names).then(response => {
        console.log(Object.fromEntries(response))
        res.send(Object.fromEntries(response))
    })
})

async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("Axios done!"), 1000)
    });
    return await promise;
}


//curl -d '{"name":"vitalik"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/search

async function checkSingleName(name) {
    let address = await provider.resolveName(name + ".eth");
    if(address === null){
        return(name + ".eth is available!");
    }else{
        return(name + ".eth is owned by " + address)
    }
}

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