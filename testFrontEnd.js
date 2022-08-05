const axios = require("axios");
const { ENS } = require('@ensdomains/ensjs')
const {ethers} = require("ethers");
const genex = require("genex");
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d163401424514af5bd48d03741865114');
const ENSInstance = new ENS()


async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("Axios done!"), 5000)
    });
    return await promise;
}

// f().then(result => {
//     console.log(result)
// })
//
// axios.get('http://localhost:3000/v1/axiosGetTwo')
//     .then(response => {
//         console.log(response.data);
//         console.log("SUCCESS")
//     })
//     .catch(error => {
//         console.log(error)
//         console.log("ERROR")
//     })

// axios.post('http://localhost:3000/v1/search', {name: "jack"})
//     .then(response => {
//         console.log(response.data);
//         console.log("SUCCESS")
//     })
//     .catch(error => {
//         console.log(error)
//         console.log("ERROR")
//     })



axios.post('http://localhost:3000/v1/checkNames', {regex: "jack\\d\\d"})
    .then(response => {
        console.log(response.data);
        console.log("SUCCESS")
    })
    .catch(error => {
        console.log(error)
        console.log("ERROR")
    })


// async function getResolver(name) {
//    let ownerInfo = await ENSInstance.getOwner(name + ".eth");
//    if(ownerInfo != null){
//        return ownerInfo.owner;
//    }else{
//        return null
//    }
// }
// async function getAddress(name) {
//     return await provider.resolveName(name + ".eth");
// }
//
// async function test(name){
//     await ENSInstance.setProvider(provider)
//     getResolver(name).then(response => {
//         console.log(response);
//     })
//     getAddress(name).then(response => {
//         console.log(response);
//     })
// }
// test("jack")

//
// async function checkNameList(nameList) {
//     const nameMap = new Map();
//     for(let i in nameList){
//         nameMap.set(nameList[i], await provider.resolveName(nameList[i] + ".eth"));
//     }
//     return nameMap;
// }
//
// checkNameList(["jack", "will", "vitalik"]).then(response => {
//     response.forEach((value, key) => {
//         console.log(value + " - " + key)
//     });
// })

//
// function getMatches(regexString) {
//     try {
//         const pattern = genex(regexString);
//         if(pattern.count() < 1000){
//             let matches = pattern.generate();
//             let legalMatches = matches.filter(word => /^[A-Za-z\d]*$/.test(word));
//             return legalMatches;
//         }
//     } catch (error) {
//         return([regexString])
//     }
// }

// console.log(getMatches("jack\\d"));



