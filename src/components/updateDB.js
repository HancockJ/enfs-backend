const ethers = require('ethers');
const ensABI = require('/Users/jackhancock/Desktop/Coding/Crypto/temp/listen-to-ens/ens.json');
const {Pool} = require("pg");
const db_conn = require("../config");
const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/d163401424514af5bd48d03741865114');
const contract = new ethers.Contract(ensAddress, ensABI, provider);
const { Pool } = require('pg')
import db_conn from '../config.js'



async function test(info) {
    // We need:
    // cost
    // expires
    // label *
    // name
    // owner *
    // node_hash *
    console.log(info.node)
    info.ttl = await contract.ttl(info.node)
    info.test = await contract.owner(info.node)
    console.log(JSON.stringify(info, null, 4))
}

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


async function main() {
    contract.on("NewOwner", (node, label, owner) =>{
        console.log("NewOwner");
        let info = {
            node: node,
            owner: owner,
            label: label,
        };
        test(info)
        // console.log(JSON.stringify(info, null, 4))
    } )
    // contract.on("Transfer", (node, owner, event) =>{
    //     console.log("Transfer");
    //     let info = {
    //         node: node,
    //         owner: owner,
    //     };
    //     console.log(JSON.stringify(info, null, 4))
    // } )
    // contract.on("NewTTL", (node, ttl, event) =>{
    //     console.log("NewTTL");
    //     let info = {
    //         node: node,
    //         owner: ttl,
    //     };
    //     console.log(JSON.stringify(info, null, 4))
    // } )
}

// let testInfo = {
//     cost: 9999999999,
//     expires: 9999999999,
//     node: 0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     name: "testENFStestENFS123000",
//     owner: 0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
//     label: 0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae,
// };

let testInfo = [9999999999,9999999999,0x99999999999999dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae,
    "testENFStestENFS123000",0x000000000000000000000000000000d1c33cfd8ed6f04690a0bcc88a93fc4ae,
    0x111111111111111111111111111111d1c33cfd8ed6f04690a0bcc88a93fc4ae]

insertInDatabase();

// console.log("Starting Updater")
// main().then();

