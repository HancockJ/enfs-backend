const ethers = require('ethers');
const controllerABI = require('../registrarControllerABI.json');
const baseRegABI = require('../baseRegistrarABI.json')


const {Pool} = require("pg");
const db_conn = require("../config");
const registrarControllerAddress = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5";
const baseRegistrarAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/d163401424514af5bd48d03741865114');
const baseContract = new ethers.Contract(baseRegistrarAddress, baseRegABI, provider);
const controlContract = new ethers.Contract(registrarControllerAddress, controllerABI, provider);
// const { Pool } = require('pg')
// import db_conn from '../config.js'



// async function test(info) {
//     // We need:
//     // cost
//     // expires
//     // label *
//     // name
//     // owner *
//     // node_hash *
//     info.ttl = await contract.ttl(info.node)
//     info.test = await contract.owner(info.node)
//     console.log(JSON.stringify(info, null, 4))
// }

function insertInDatabase() {
    const pool = new Pool(db_conn.production.connection_uri)
    if (pool) {
    }
    console.log("--- Trying to insert value")
    const text = 'INSERT INTO name_registered ("cost, expires, label, name, owner, node_hash") VALUES (9999999999,9999999999,0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,"testENFStestENFS123000",0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae) ON CONFLICT DO NOTHING'
    pool.query(text, (err, res) => {
        console.log(err)
        console.log(res)
    });
}

async function baseMonitor() {
    baseContract.on("Transfer", (from, to, tokenID) =>{
        let info = {
            from: from,
            to: to,
            id: tokenID
        };
        console.log('----------------------')
        console.log("Transfer", info)
    } )
}


async function controlMonitor() {
    // event NameRegistered(string name, bytes32 indexed label, address indexed owner, uint cost, uint expires);
    controlContract.on("NameRegistered", (name, label, owner, cost, expires) =>{
        let info = {
            name: name,
            owner: owner,
            label: label,
            cost: cost,
            expires: expires
        };
        console.log('----------------------')
        console.log("Name Registered", info)
    } )
    // event NameRenewed(string name, bytes32 indexed label, uint cost, uint expires);
    controlContract.on("NameRenewed", (name, label, cost, expires) =>{
        let info = {
            name: name,
            label: label,
            cost: cost,
            expires: expires
        };
        console.log('----------------------')
        console.log("Name Renewed", info)
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

// console.log("Starting Event Monitors")
// baseMonitor().then()
// controlMonitor().then()
insertInDatabase();

