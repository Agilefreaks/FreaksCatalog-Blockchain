const { expect, assert } = require("chai");

describe("Profit Allocation -- Tests", function () {
  beforeEach(async () => {
    [admin, hr, other, financial, contract] = await ethers.getSigners();
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
    freakTeamFromHr = await freakTeam.connect(hr);

    await freakTeamFromHr.addNewFreak(
      other.address,
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

  it("Set amount fails when it's not called by financial", async function () {
    await expect(
      profitSharingContractFromHr.allocate(100000, 1609391249, 1617163649)
    ).to.be.revertedWith("Caller is not a financial");
  });
  it("Set amount failes when the balance of the contract does not change", async function () {
    expect(
      await usdcContractFromFinancial.balanceOf(profitSharing.address)
    ).to.equal(100000);
  });
  it("Profit allocation fails when it does not allow profit correctly", async function () {
    expect(
      await usdcContractFromFinancial.allowance(
        profitSharing.address,
        other.address
      )
    ).to.equal(26412);
    expect(
      await usdcContractFromFinancial.allowance(
        profitSharing.address,
        hr.address
      )
    ).to.equal(26412);
    expect(
      await usdcContract.allowance(profitSharing.address, admin.address)
    ).to.equal(23572);
    expect(
      await usdcContractFromFinancial.allowance(
        profitSharing.address,
        financial.address
      )
    ).to.equal(23572);
  });
  it("Set amount failes when it doesn't emit corect events", async function () {
    await usdcContractFromFinancial.approve(
      profitSharingContractFromFinancial.address,
      100000
    );
    await expect(
      profitSharingContractFromFinancial.allocate(
        100000,
        1609391249,
        1617163649
      )
    )
      .to.emit(profitSharing, "allocatedProfit")
      .withArgs(100000, 1609391249, 1617163649);
  });
});
