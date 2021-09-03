const { expect, assert } = require("chai");

describe("Set amount -- Tests", function () {
  beforeEach(async () => {
    profitSharingContractFactory = await ethers.getContractFactory(
      "ProfitSharing"
    );
    usdcContractFactory = await ethers.getContractFactory("USDC");
    [admin, hr, other, financial, contract] = await ethers.getSigners();
    usdcContract = await usdcContractFactory.deploy("USDC TOKEN", "USDC", financial.address);
    profit = await profitSharingContractFactory.deploy(
      hr.address,
      financial.address,
      usdcContract.address
    );
    await profit
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 1598846849, 1, 1, 1, 0);
    await profit
      .connect(hr)
      .addNewFreak(hr.address, "TestFreak1", 1598846849, 2, 1, 1, 0);
    await profit
      .connect(hr)
      .addNewFreak(admin.address, "TestFreak2", 1598846849, 3, 1, 1, 1);
    await profit
      .connect(hr)
      .addNewFreak(financial.address, "TestFreak3", 1598846849, 3, 1, 1, 1);
  });

  it.only("Set amount fails when it's not called by financial", async function () {
    await expect(
      profit.connect(other).setAmount(profit.address, 100000)
    ).to.be.revertedWith("Caller is not a financial");
  });
  it.only("Set amount failes when the balance of the contract does not change", async function () {
    // console.log(financial.address);
    // console.log(await usdcContract.balanceOf(financial.address));
    // console.log(usdcContract.address);
    // console.log(profit.address);
    (await profit.connect(financial).setAmount(profit.address, 3));
      //  console.log(await profit.setAmount(profit.address, 3));
    // console.log(await profit.connect(financial).balanceOf(financial.address));

    // expect(profit freak.connect(financial).setAmount(financial.address, other.address, 100)).to.equal(1);
    // expect(profit freak.balanceOf(contract.address)).to.equal(
    //     100000
    //   );
  });
});
