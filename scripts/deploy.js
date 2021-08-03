// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Freaks = await hre.ethers.getContractFactory("Freaks");
  const freaks = await Freaks.deploy("0xB7A7f3f3Da54A6c81F45E3fDb4b06D52775b95cd","0x5Afa594b9f2B62F80806c45F24847Eb18cB5B169");

  await freaks.deployed();

  console.log("Freaks deployed to:", freaks.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
