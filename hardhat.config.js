require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
module.exports = {
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/df34d380f59e469c97f1dab44199bca6",
      accounts: {
        mnemonic: "industry layer bird test junk shadow visa lottery human spatial pact balcony"
      }
    }
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
