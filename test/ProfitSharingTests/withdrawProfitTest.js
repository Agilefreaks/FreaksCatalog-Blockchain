const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");

describe("Withdraw Profit -- Tests", function () {
  beforeEach(async () => {
    profitSharingContractFactory = await ethers.getContractFactory(
      "ProfitSharing"
    );
    usdcContractFactory = await ethers.getContractFactory("USDC");
    [admin, hr, other, financial, contract, freak] = await ethers.getSigners();
    usdcContract = await usdcContractFactory.deploy(
      "USDC TOKEN",
      "USDC",
      financial.address
    );
    profitSharing = await profitSharingContractFactory.deploy(
      hr.address,
      financial.address,
      usdcContract.address
    );
    await profitSharing
      .connect(hr)
      .addNewFreak(freak.address, "TestFreak", 1598846849, 1, 1, 1, 0);
    await profitSharing
      .connect(hr)
      .addNewFreak(hr.address, "TestFreak1", 1598846849, 2, 1, 1, 0);
    await profitSharing
      .connect(hr)
      .addNewFreak(admin.address, "TestFreak2", 1598846849, 3, 1, 1, 1);
    await profitSharing
      .connect(hr)
      .addNewFreak(financial.address, "TestFreak3", 1598846849, 3, 1, 1, 1);

    profitSharingContractFromFinancial = await profitSharing.connect(financial);
    usdcContractFromFinancial = await usdcContract.connect(financial);
    usdcContractFromFreak = await usdcContract.connect(freak);
    profitSharingContractFromFreak = await profitSharing.connect(freak);
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

  it("Withdraw Profit fails when it's not called by a freak", async function () {
    await expect(
      profitSharing
        .connect(financial)
        .withdrawProfit(
          profitSharing.address,
          freak.address,
          other.address,
          26412
        )
    ).to.be.revertedWith("Caller is not a freak");
  });
  it("Withdraw Profit failes when freak doesn't have such a large amount allocated", async function () {
    expect(
      profitSharing
        .connect(freak)
        .withdrawProfit(
          profitSharing.address,
          freak.address,
          other.address,
          100000
        )
    ).to.be.revertedWith("You don't have such a large amount allocated");
  });
  it("Withdraw profit fails when it doesn't transfer corectly amount", async function () {
    await usdcContractFromFreak.approve(freak.address, 2500000);
    await profitSharingContractFromFreak.withdrawProfit(
      profitSharing.address,
      freak.address,
      other.address,
      2
    );
    expect(BigNumber.from(2)).to.eql(
      await usdcContract.balanceOf(other.address)
    );
  });
  it("Withdraw profit fails when it doesn't emit an event", async function () {
    await usdcContractFromFreak.approve(freak.address, 2500000);
    await profitSharingContractFromFreak.withdrawProfit(
      profitSharing.address,
      freak.address,
      other.address,
      2
    );
    await expect(
      profitSharingContractFromFreak.withdrawProfit(
        profitSharing.address,
        freak.address,
        other.address,
        2
      )
    )
      .to.emit(profitSharing, "withdrewProfit")
      .withArgs("TestFreak", other.address, 2);
  });
});
