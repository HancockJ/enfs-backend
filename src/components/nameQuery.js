const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d163401424514af5bd48d03741865114');
const { ENS } = require('@ensdomains/ensjs')
const ENSInstance = new ENS()
const genex = require("genex");
const { Pool } = require('pg')
import db_conn from '../config.js'
function getNameList(regexString) {
    try {
        const pattern = genex(regexString);
        if (pattern.count() < 1000) {
            let matches = pattern.generate();
            console.log("matches", matches)
            return matches.filter(word => /^[A-Za-z\d]*$/.test(word));

        }
    } catch (error) {
        return ([regexString])
    }
}

async function checkNameList(nameList) {
    const nameMap = new Map();
    await ENSInstance.setProvider(provider)
    const promiseMap = nameList.map(name => ENSInstance.getOwner(name + ".eth"));
    let values = await Promise.all(promiseMap)
    for (let i in values) {
        if (values[i] != null) {
            nameMap.set(nameList[i], {"owner":values[i].owner,"name":nameList[i]});
        } else {
            nameMap.set(nameList[i], {"owner":null,"name":null});
        }
    }
    
    return nameMap;
}
async function checkDB(regexString) {

    const pool = new Pool(db_conn.production.connection_uri)
    if (pool) {
    }
    const text = 'SELECT * FROM name_registered WHERE name ~ $1'
    const values = [regexString]
    return pool.query(text, values).then(res => {
        for (const element of res.rows) {
            console.log(element.name)
        }
        pool.end()
        return res.rows
    })
        .catch(e => console.error(e.stack))
}
module.exports = function (regexString) {
    const names = getNameList(regexString) //getting generated list from regex string
    return checkDB(regexString).then(async function(db_names) { //getting relevant names from db (there might not be 1:1 match)
        let obj = {}
        db_names.forEach(function (name) { //scrap the database responses not included in generated names
            if (names.includes(name.name)) {
                obj[name.name] = name
            }
        })
        let unchecked_names = names.map(function (item) { //take generated names that were not already scraped into db
            if (!Object.keys(obj).includes(item)) {
                return item
            }
            else return null
        }).filter(n => n)
        
        const checked_names = await checkNameList(unchecked_names) //check those names that are left. generated_names-db_names
        for(let name of checked_names){
            obj[name[0]] = name[1]
        }
        return obj
    });
};
