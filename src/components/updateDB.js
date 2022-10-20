const ethers = require('ethers');
const controllerABI = require('../registrarControllerABI.json');
const baseRegABI = require('../baseRegistrarABI.json')


const {Pool} = require("pg");
const {BigNumber} = require("ethers");
// const db_conn = require("../config");
const db_conn = {
    "debug":{
        "connection_uri":{
            "user": "postgres",
            "host": "localhost",
            "database": "ens_database",
            "password": "kentucky",
            "port": 5432
        }
    },
    "production":{
        "connection_uri":{
            "user": "postgres",
            "host": "localhost",
            "database": "ens_db",
            "password": "kentucky",
            "port": 5432
        }
    }
};
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

function insertInDatabase(values) {
    const pool = new Pool(db_conn.production.connection_uri)
    if (pool) {
    }
    const query = 'INSERT INTO name_registered(cost, expires, label, name, owner, node_hash) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING'
    pool.query(query, values, (err, res) => {
       if(err){
           console.log(err)
       } else{
           console.log(res.rowCount)
       }
    });
}

function updateExpiration(values) {
    const pool = new Pool(db_conn.production.connection_uri)
    if (pool) {
    }
    const query = 'UPDATE name_registered SET expires = $1 WHERE label = $2'
    pool.query(query, values, (err, res) => {
        if(err){
            console.log(err)
        } else{
            console.log(res.rowCount)
        }
    });
}

function transferName(values) {
    const pool = new Pool(db_conn.production.connection_uri)
    if (pool) {
    }
    const query = 'UPDATE name_registered SET owner = $1 WHERE label = $2'
    pool.query(query, values, (err, res) => {
        if(err){
            console.log(err)
        } else{
            console.log(res.rowCount)
        }
    });
}

async function baseMonitor() {
    baseContract.on("Transfer", (from, to, tokenID) =>{
        const label = BigNumber.from(tokenID).toHexString()
        let details = {
            from: from,
            to: to,
            id: label
        };
        let info = [to, label];
        console.log('----------------------')
        console.log("Transfer", details)
        transferName(info)
    } )
}


async function controlMonitor() {
    // event NameRegistered(string name, bytes32 indexed label, address indexed owner, uint cost, uint expires);
    controlContract.on("NameRegistered", (name, label, owner, cost, expires) =>{
        let details = {
            name: name,
            label: label,
            cost: cost,
            expires: expires
        };
        let entry = [cost, expires, label, name, owner, "0x9999999999999999999999999999999999999999999999999999999999999999"]
        console.log('----------------------')
        console.log("Name Registered", details)
        insertInDatabase(entry)
    } )
    // event NameRenewed(string name, bytes32 indexed label, uint cost, uint expires);
    controlContract.on("NameRenewed", (name, label, cost, expires) =>{
        let details = {
            name: name,
            label: label,
            cost: cost,
            expires: expires
        };
        let info = [expires, label];
        console.log('----------------------')
        console.log("Name Renewed", details)
        updateExpiration(info)
    } )
}

// let testInfo = {
//     cost: 9999999999,
//     expires: 9999999999,
//     label: 0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     name: "testENFStestENFS123000",
//     owner: 0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     node: 0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
// };

// let testInfo = [9999999999,9999999999,0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     "testENFStestENFS123000",0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae]
//
// insertInDatabase();

// console.log("Starting Event Monitors")
baseMonitor().then()
controlMonitor().then()
// insertInDatabase(testInfo);

