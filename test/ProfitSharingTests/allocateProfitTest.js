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
    await freak
      .connect(hr)
      .addNewFreak(hr.address, "TestFreak1", 1598846849, 2, 1, 1, 0);
    await freak
      .connect(hr)
      .addNewFreak(admin.address, "TestFreak2", 1598846849, 3, 1, 1, 1);
      await freak.connect(financial).allocate(100000, 1609391249, 1617163649);
  });

  it("Profit Alocation fails when it's not called by financial", async function () {
    await expect(
      freak.connect(other).allocate(100000, 1609391249, 1617163649)
    ).to.be.revertedWith("Caller is not a financial");
  });
  it("Profit allocation fails when it does not allow profit correctly", async function () {
    expect(await usdcContract.allowance(financial.address, other.address)).to.equal(
      34410
    );
    expect(await usdcContract.allowance(financial.address, hr.address)).to.equal(
      34410
    );
    expect(await usdcContract.allowance(financial.address, admin.address)).to.equal(
      30710
    );
  });
  it("Profit allocation fails when it does not calculate profit correctly", async function () {
    await freak.connect(financial).allocate(100000, 1609391249, 1617163649);
    expect(await freak.allowance(financial.address, other.address)).to.equal(
      68820
    );
    expect(await freak.allowance(financial.address, hr.address)).to.equal(
      68820
    );
    expect(await freak.allowance(financial.address, admin.address)).to.equal(
      61420
    );
  });

  it("profit allocation fails when it doesn't not emit an event", async function () {
    await freak.connect(financial).allocate(100000, 1609391249, 1617163649);
    await expect(
      freak.connect(financial).allocate(100000, 1609391249, 1617163649)
    )
      .to.emit(freak, "allocatedProfit")
      .withArgs(100000, 1609391249, 1617163649);
  });
});
