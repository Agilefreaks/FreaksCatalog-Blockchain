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
    expect(await FreakTeam.connect(other).isFinancial(other.address)).to.equal(false);
  });
  it("Is financial works when it is called by a financial", async function () {
    expect(await FreakTeam.connect(financial).isFinancial(financial.address)).to.equal(true);
  });
});
