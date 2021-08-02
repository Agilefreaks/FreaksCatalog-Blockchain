const hre = require("hardhat");

async function main() {
  const Freaks = await hre.ethers.getContractFactory("Freaks");
  const freaks = await Freaks.deploy("0xB7A7f3f3Da54A6c81F45E3fDb4b06D52775b95cd","0x5Afa594b9f2B62F80806c45F24847Eb18cB5B169");

  await freaks.deployed();

  console.log("Freaks deployed to:", freaks.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });