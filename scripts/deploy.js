const hre = require("hardhat");

async function main() {
  const Freaks = await hre.ethers.getContractFactory("FreakTeam");
  const freaks = await Freaks.deploy("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", "0x6F04BfD7aBa103815af0a220a9DC45C31c0Fd84F");

  const hr = await ethers.getSigner('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199');

  await freaks.connect(hr).addNewFreak('0x6F7b238190C6C2Ff73Ea66a005476ea6d511229C', 'Edi', 2021, 1, 1, 1);
  await freaks.connect(hr).addNewFreak('0x47A91b509aD0e5bce4b8b05c6A89aac28079Df0C', 'Adi', 2015, 2, 1, 0);
  await freaks.connect(hr).addNewFreak('0xc599aCee6Fa74E363eF18D7ed0DF9574dF18c704', 'Gabi', 2021, 3, 1, 2);
  await freaks.connect(hr).addNewFreak('0x93505b68BB8b6f6dd9DeFb570A5eB69fACf0FDc4', 'Calin', 2010, 4, 0, 3);
  await freaks.connect(hr).addNewFreak('0xFC9CF410cB7D9c5F0Db2db75ac3361AcB97027e6', 'Mihai', 2010, 5, 0, 2);
  await freaks.connect(hr).addNewFreak('0xd50276acA10e198E2d8a1038FED64bCD5Cb2F2dC', 'Catalin', 2010, 6, 0, 4);

  
  await freaks.deployed();

  console.log("Freaks deployed to:", freaks.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });