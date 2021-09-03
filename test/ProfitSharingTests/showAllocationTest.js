const { expect, assert } = require("chai");

describe("Profit allocation -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("ProfitSharing");
    usdcContractFactory = await ethers.getContractFactory("USDC");
    usdcContract = await usdcContractFactory.deploy("USDC TOKEN", "USDC");
    [admin, hr, other, financial, contract] = await ethers.getSigners();
    freak = await freakAccounts.deploy(
      hr.address,
      financial.address,
      usdcContract.address
    );
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 1598846849, 1, 1, 1, 0);
  });

  it("Show Alocation fails when it's not called by financial", async function () {
    await expect(
      freak.connect(other).showAllocation(financial.address)
    ).to.be.revertedWith("Caller is not a financial");
  });
  it("Show allocation fails when it does return good values", async function () {
    await freak.allocate(10);
    let [name, allocation] = await freak.showAllocation(hr.address);
    expect(name).to.equal("TestFreak1");
    expect(allocation).to.equal(34410);
  });
});
