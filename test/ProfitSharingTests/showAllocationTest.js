const { expect, assert } = require("chai");

describe("Show Profit allocation -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("ProfitSharing");
    usdcContractFactory = await ethers.getContractFactory("USDC");
    [admin, hr, other, financial, contract,freak] = await ethers.getSigners();
    usdcContract = await usdcContractFactory.deploy(
      "USDC TOKEN",
      "USDC",
      financial.address
    );
    profitSharing = await freakAccounts.deploy(
      hr.address,
      financial.address,
      usdcContract.address
    );
    profitSharingContractFromFinancial = await profitSharing.connect(financial);
    profitSharingContractFromFreak = await profitSharing.connect(freak);
    profitSharingContractFromHr = await profitSharing.connect(hr);
    usdcContractFromFinancial = await usdcContract.connect(financial);
    await profitSharingContractFromHr
      .addNewFreak(freak.address, "TestFreak", 1598846849, 1, 1, 1, 0);


    await usdcContractFromFinancial.approve(
      profitSharing.address,
      100000
    );
    await profitSharingContractFromFinancial.setAmount(
      100000,
      1609391249,
      1617163649
    );
  });
  it("Show allocation fails when it does return good values", async function () {
    expect((await profitSharingContractFromFreak.Allocation()).toNumber()).to.equal(99975);
  });
});
