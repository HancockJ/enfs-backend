import express from 'express';
import { infuraKey } from '../config';
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

indexRouter.get('/axiosGet', (req,res) => {
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

indexRouter.post('/search', (req,res) => {
    let input = JSON.stringify(req.body)
    // console.log(input)
    let name = JSON.parse(input).name
    // let name = input.name;
   checkSingleName(name).then(response => {
       res.send(String(response));
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

async function checkName(name) {
    provider.resolveName(name + ".eth").then(ens => {
        if(ens === null){
            console.log(name + ".eth is available!");
            return(name + ".eth is available!");
        }else{
            console.log(name + ".eth is owned by " + ens);
            return(name + ".eth is owned by " + ens)
        }
    })
}

export default indexRouter;