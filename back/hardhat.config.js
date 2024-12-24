require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    // sepolia: {
    //   url: process.env.ALCHEMY_URL,
    //   accounts: [`${process.env.ACCOUNT_PRIVATE_KEY}`],
    // },

    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },

    testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: `${process.env.mnemonic}` },
    },

    etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://bscscan.com/
      url: "https://api-testnet.bscscan.com/api",
      apiKey: `${process.env.bscscanApiKey}`,
    },
  },
};
