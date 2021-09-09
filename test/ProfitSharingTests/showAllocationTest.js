const { expect, assert } = require("chai");

describe("Show Profit allocation -- Tests", function () {
  beforeEach(async () => {
    [admin, hr, other, financial, contract, freak] = await ethers.getSigners();

    freakTeamContractFactory = await ethers.getContractFactory("FreakTeam");
    freakTeam = await freakTeamContractFactory.deploy(
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
    profitSharingContractFromFinancial = await profitSharing.connect(financial);
    profitSharingContractFromFreak = await profitSharing.connect(freak);
    profitSharingContractFromHr = await profitSharing.connect(hr);
    usdcContractFromFinancial = await usdcContract.connect(financial);
    freakTeamFromHr = await freakTeam.connect(hr);
    await freakTeamFromHr.addNewFreak(
      freak.address,
      "TestFreak",
      1598846849,
      1,
      1,
      1,
      0
    );
    await usdcContractFromFinancial.approve(profitSharing.address, 100000);
    await profitSharingContractFromFinancial.allocate(
      100000,
      1609391249,
      1617163649
    );
  });
  it("Show allocation fails when it does return good values", async function () {
    expect(
      (await profitSharingContractFromFreak.allocation()).toNumber()
    ).to.equal(99975);
  });
});
