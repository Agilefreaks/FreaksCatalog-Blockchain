const { expect, assert } = require("chai");

describe("Is Financial -- Tests", function () {
  beforeEach(async () => {
    FreakTeamContractFactory = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    FreakTeam = await FreakTeamContractFactory.deploy(
      hr.address,
      financial.address
    );
    freakTeamContractFromHr = await FreakTeam.connect(hr);
    await freakTeamContractFromHr
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 1);
  });

  it("Is financial fails when it's not called by financial", async function () {
    await expect(FreakTeam.connect(other).isFinancial()).to.be.revertedWith(
      "Caller is not a financial"
    );
  });
  it("AddFreak fails when skill is not added", async function () {
    expect(await FreakTeam.connect(financial).isFinancial()).to.equal(true);
  });
});
