const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");

describe("Withdraw Profit -- Tests", function () {
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
    profitSharingContractFromHr = await profitSharing.connect(hr);
    usdcContractFromFinancial = await usdcContract.connect(financial);
    profitSharingContractFromFinancial = await profitSharing.connect(financial);
    profitSharingContractFromFreak = await profitSharing.connect(freak);
    freakTeamFromHr = await freakTeam.connect(hr);
   //TODO: creat 2 variable startOfQuarter si endOfQuarter
    await freakTeamFromHr.addNewFreak(
      freak.address,
      "TestFreak",
      1598846849,
      1,
      1,
      1,
      0
    );
    await freakTeamFromHr.addNewFreak(
      hr.address,
      "TestFreak1",
      1598846849,
      2,
      1,
      1,
      0
    );
    await freakTeamFromHr.addNewFreak(
      admin.address,
      "TestFreak2",
      1598846849,
      3,
      1,
      1,
      1
    );
    await freakTeamFromHr.addNewFreak(
      financial.address,
      "TestFreak3",
      1598846849,
      3,
      1,
      1,
      1
    );
    await usdcContractFromFinancial.approve(profitSharing.address, 100000);
    await profitSharingContractFromFinancial.allocate(
      100000,
      1609391249,
      1617163649
    );
  });

  it("Withdraw Profit fails when freak doesn't have such a large amount allocated", async function () {
    expect(
      profitSharingContractFromFreak.withdrawProfit(freak.address, 100000)
    ).to.be.revertedWith("You don't have such a large amount allocated");
  });
  it("Withdraw profit works when freak  transfers amount corectly", async function () {
    await profitSharingContractFromFreak.withdrawProfit(freak.address, 9000);
    expect(BigNumber.from(9000)).to.eql(
      await usdcContract.balanceOf(freak.address)
    );
  });
  it("Withdraw profit fails when freak doesn't transfer corectly amount in his new wallet", async function () {
    await profitSharingContractFromFreak.withdrawProfit(other.address, 9000);
    expect(BigNumber.from(9000)).to.eql(
      await usdcContract.balanceOf(other.address)
    );
  });
  it("Withdraw profit fails when it doesn't emit an event", async function () {
    await profitSharingContractFromFreak.withdrawProfit(freak.address, 2);
    await expect(
      profitSharingContractFromFreak.withdrawProfit(freak.address, 2)
    )
      .to.emit(profitSharing, "withdrewProfit")
      .withArgs("TestFreak", freak.address, 2);
  });
});
