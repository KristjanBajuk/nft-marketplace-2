require("@nomiclabs/hardhat-waffle");
const projectId = '85e946043c9f47fda6f5b2b9c1fcb911';
const fs = require('fs');
const keyData = fs.readFileSync('./p-key.txt', {
  encoding: 'utf-8', flag: 'r'
});

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337 // config standard
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [keyData]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts:[keyData]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      } 
    }
  },
};
