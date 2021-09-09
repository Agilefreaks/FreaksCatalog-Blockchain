const hre = require("hardhat");

async function main() {
  [
    admin,
    hr,
    other,
    financial,
    freak1,
    freak2,
    freak3,
    freak4,
    freak5,
  ] = await ethers.getSigners();
  const freakTeamContractFactory = await hre.ethers.getContractFactory(
    "FreakTeam"
  );
  const freakTeam = await freakTeamContractFactory.deploy(
    hr.address,
    financial.address
  );
  profitSharingContractFactory = await ethers.getContractFactory(
    "ProfitSharing"
  );
  usdcContractFactory = await ethers.getContractFactory("USDC");
  usdcContract = await usdcContractFactory.deploy(
    "USDC TOKEN",
    "USDC",
    financial.address
  );
  profitSharing = await profitSharingContractFactory.deploy(
    usdcContract.address,
    freakTeam.address
  );

  await freakTeam
    .connect(hr)
    .addNewFreak(freak1.address, "Edi", 2021, 1, 1, 1, 0);
  await freakTeam
    .connect(hr)
    .addNewFreak(freak2.address, "Adi", 2015, 2, 1, 0, 0);
  await freakTeam
    .connect(hr)
    .addNewFreak(freak3.address, "Gabi", 2021, 3, 1, 2, 0);
  await freakTeam
    .connect(hr)
    .addNewFreak(freak4.address, "Calin", 2010, 4, 0, 3, 0);
  await freakTeam
    .connect(hr)
    .addNewFreak(freak5.address, "Mihai", 2010, 5, 0, 2, 0);
  await freakTeam.deployed();

  console.log("Freaks deployed to:", freakTeam.address);
  console.log("Profit sharing deployed to: ", profitSharing.address);
  console.log("USDC deployed to: ", usdcContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
