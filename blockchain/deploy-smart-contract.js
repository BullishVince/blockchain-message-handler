const fs = require('fs'); //Built-in dependency for file streaming.
const solc = require('solc'); //Solidity compiler
const Web3 = require('web3');

const content = fs.readFileSync('blockchain/message-contract.sol', 'utf-8'); // Read the file...

// Format the input for solc compiler:
const input = {
  language: 'Solidity',
  sources: {
    'blockchain/message-contract.sol' : {
      content, // The imported content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}; 
const compilationOutput = solc.compile(JSON.stringify(input));

//Save the compiled output to bin, which can later be used as interface when communicating against the smart contract
fs.writeFileSync('blockchain/bin/compilation-output', compilationOutput, 'utf-8')

const output = JSON.parse(compilationOutput);
console.log(output); // Log output from compiler

//Set up a provider
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

//Connect to the blockchain and save the connection object as web3
const web3 = new Web3(provider);

// Get the compiled contract's abi (interface)
const { MessageContract } = output.contracts["blockchain/message-contract.sol"]
const { abi, evm } = MessageContract // We'll use the "evm" variable later
 

// Initialize a new contract object:
const contract = new web3.eth.Contract(abi);
console.log(contract);

const deployAndRunContract = async () => {
  // Get the addresses of Ganache's fake wallet:
  const addresses = await web3.eth.getAccounts();
  
  // Get the current price of gas
  const gasPrice = await web3.eth.getGasPrice();

  // Deploy the HelloWorld contract (its bytecode) 
  // by spending some gas from our first address
  contract.deploy({
    data: evm.bytecode.object,
  })
  .send({
    from: addresses[0],
    gas: 1000000,
    gasPrice,
  })
  .on('confirmation', async (confNumber, receipt) => {
    const { contractAddress } = receipt
    console.log("Deployed at", contractAddress);

    //Save the contract address in bin
    fs.writeFileSync('blockchain/bin/contract-address', contractAddress, 'utf-8')

    // Get the deployed contract instance:
    const contractInstance = new web3.eth.Contract(abi, contractAddress)

    // Call the "getMessage" function and log the result:
    const message = await contractInstance.methods.getMessage().call();
    console.log("Result from blockchain:", message);
  })
  .on('error', (err) => {
    console.log("Failed to deploy:", error) 
  })
}

deployAndRunContract(); // Call the function