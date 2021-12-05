var express = require('express')
var router = express.Router();
const fs = require('fs');
const Web3 = require('web3')

router.get('', async function(req, res){
    const provider = new Web3.providers.HttpProvider("http://localhost:8545");
    const web3 = new Web3(provider);

    const output = JSON.parse(fs.readFileSync('blockchain/bin/compilation-output', 'utf-8'));
    const { MessageContract } = output.contracts["blockchain/message-contract.sol"];
    const { abi, evm } = MessageContract;

    const contractAddress = fs.readFileSync('blockchain/bin/contract-address', 'utf-8');
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    const message = await contractInstance.methods.getMessage().call();

    res.json(
        { 'success' : true,
          'route' : 'message',
          'data': message
        });
});

module.exports = router;