const ethers = require('ethers');
const ensABI = require('/Users/jackhancock/Desktop/Coding/Crypto/temp/listen-to-ens/ens.json');

async function main() {
    const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    const provider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/d163401424514af5bd48d03741865114');
    const contract = new ethers.Contract(ensAddress, ensABI, provider);
    contract.on("NewOwner", (node, label, owner, event) =>{
        console.log("NewOwner");
        let info = {
            node: node,
            owner: owner,
            label: label,
        };
        console.log(JSON.stringify(info, null, 4))
    } )
    contract.on("Transfer", (node, owner, event) =>{
        console.log("Transfer");
        let info = {
            node: node,
            owner: owner,
        };
        console.log(JSON.stringify(info, null, 4))
    } )
    contract.on("NewTTL", (node, ttl, event) =>{
        console.log("NewTTL");
        let info = {
            node: node,
            owner: ttl,
        };
        console.log(JSON.stringify(info, null, 4))
    } )

    //TODO: Get the ENS nameHash normalizer
    //TODO: Get all contract on responses depositing into the same spot.
}

main();