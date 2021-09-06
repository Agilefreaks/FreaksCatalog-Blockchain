const { expect, assert } = require("chai");

describe("Show Profit allocation -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("ProfitSharing");
    usdcContractFactory = await ethers.getContractFactory("USDC");
    [admin, hr, other, financial, contract] = await ethers.getSigners();
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
    await profitSharing
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 1598846849, 1, 1, 1, 0);

    profitSharingContractFromFinancial = await profitSharing.connect(financial);
    usdcContractFromFinancial = await usdcContract.connect(financial);
    await usdcContractFromFinancial.approve(
      profitSharingContractFromFinancial.address,
      100000
    );
    await profitSharingContractFromFinancial.setAmount(
      profitSharing.address,
      100000,
      1609391249,
      1617163649
    );
  });

  it("Show Alocation fails when it's not called by financial", async function () {
    await expect(
      profitSharing.connect(other).Allocation(financial.address)
    ).to.be.revertedWith("Caller is not a financial");
  });
  it("Show allocation fails when it does return good values", async function () {
    let [name, allocation] =
      await profitSharingContractFromFinancial.Allocation(other.address);
    expect(name).to.equal("TestFreak");
    expect(
      await usdcContractFromFinancial.allowance(
        profitSharing.address,
        other.address
      )
    ).to.equal(99975);
  });
});
