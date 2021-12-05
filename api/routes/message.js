var express = require('express')
var router = express.Router();
const fs = require('fs');
const Web3 = require('web3')

function getCurrentContractInstance() {
  const provider = new Web3.providers.HttpProvider("http://localhost:8545");
  const web3 = new Web3(provider);

  const output = JSON.parse(fs.readFileSync('blockchain/bin/compilation-output', 'utf-8'));
  const { MessageContract } = output.contracts["blockchain/message-contract.sol"];
  const { abi, evm } = MessageContract;

  const contractAddress = fs.readFileSync('blockchain/bin/contract-address', 'utf-8');
  return new web3.eth.Contract(abi, contractAddress);
}

router.get('', async function(res){
    const contractInstance = getCurrentContractInstance();
    const message = await contractInstance.methods.getMessage().call();

    res.json(
        { 'success' : true,
          'route' : 'message',
          'data': message
        });
});

router.post('', async function(req, res){
  const contractInstance = getCurrentContractInstance();
  await contractInstance.methods.changeMessage(req.query.message).call();
  res.json(
      { 'success' : true,
        'route' : 'message',
        'data': req.query.message
      });
});

module.exports = router;