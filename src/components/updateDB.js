const ethers = require('ethers');
const ensABI = require('/Users/jackhancock/Desktop/Coding/Crypto/temp/listen-to-ens/ens.json');
const baseRegABI = require('../baseRegistrar.json')
const regABI = require('../realReg.json')


// const {Pool} = require("pg");
// const db_conn = require("../config");
const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const ensRegistrar = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5";
const baseRegistrar = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/d163401424514af5bd48d03741865114');
const contract = new ethers.Contract(ensAddress, ensABI, provider);
const regContract = new ethers.Contract(ensRegistrar, baseRegABI, provider);
const baseContract = new ethers.Contract(baseRegistrar, regABI, provider);
// const { Pool } = require('pg')
// import db_conn from '../config.js'



async function test(info) {
    // We need:
    // cost
    // expires
    // label *
    // name
    // owner *
    // node_hash *
    info.ttl = await contract.ttl(info.node)
    info.test = await contract.owner(info.node)
    console.log(JSON.stringify(info, null, 4))
}

// function insertInDatabase() {
//     const pool = new Pool(db_conn.production.connection_uri)
//     if (pool) {
//     }
//     console.log("--- Trying to insert value")
//     const text = 'INSERT INTO name_registered ("cost, expires, label, name, owner, node_hash") VALUES (9999999999,9999999999,0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,"testENFStestENFS123000",0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae) ON CONFLICT DO NOTHING'
//     pool.query(text, (err, res) => {
//         console.log(err)
//         console.log(res)
//     });
// }

async function newTest() {
    baseContract.on("NameRegistered", (tokenID, owner, expires) =>{
        let info = {
            id: tokenID,
            owner: owner,
            expires: expires
        };
        console.log('----------------------')
        console.log("Name Registered", info)
        // console.log(JSON.stringify(info, null, 4))
    } )
    baseContract.on("Transfer", (from, to, tokenID) =>{
        let info = {
            from: from,
            to: to,
            id: tokenID
        };
        console.log('----------------------')
        console.log("Transfer", info)
        // console.log(JSON.stringify(info, null, 4))
    } )
}


async function registrar() {
    regContract.on("NameRegistered", (name, label, owner, cost, expires) =>{
        let info = {
            name: name,
            owner: owner,
            label: label,
            cost: cost,
            expires: expires
        };
        console.log('----------------------')
        console.log("Name Registered", info)
        // console.log(JSON.stringify(info, null, 4))
    } )
}

async function main() {
    contract.on("NewOwner", (node, label, owner) =>{
        let info = {
            // node: node,
            owner: owner,
            label: label,
        };
        console.log('----------------------')
        console.log("New Owner", info)
        // test(info)
        // console.log(JSON.stringify(info, null, 4))
    } )
    contract.on("Transfer", (node, owner, event) =>{
        console.log("Transfer");
        let info = {
            node: node,
            owner: owner,
        };
        console.log("Transfer", info)
        // console.log(JSON.stringify(info, null, 4))
    } )
    contract.on("NewTTL", (node, ttl, event) =>{
        console.log("NewTTL");
        let info = {
            node: node,
            owner: ttl,
        };
        console.log("New TTL", info)
        // console.log(JSON.stringify(info, null, 4))
    } )
}

// let testInfo = {
//     cost: 9999999999,
//     expires: 9999999999,
//     node: 0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     name: "testENFStestENFS123000",
//     owner: 0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     label: 0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae,
// };

// let testInfo = [9999999999,9999999999,0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     "testENFStestENFS123000",0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae]
//
// insertInDatabase();

console.log("Starting Updater")
// main().then();
// registrar().then();
newTest().then();

