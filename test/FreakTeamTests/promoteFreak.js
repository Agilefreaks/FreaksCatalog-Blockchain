const { expect, assert } = require("chai");

describe("Promote Freak -- Tests", function () {
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

  it("PromoteFreak fails when it's not called by hr", async function () {
    await expect(
      FreakTeam.connect(other).promoteFreak(other.address, 1)
    ).to.be.revertedWith("Caller is not a hr");
  });

  it("PromoteFreak fails when caller try to promote himself", async function () {
    await expect(
      freakTeamContractFromHr.promoteFreak(hr.address, 1)
    ).to.be.revertedWith("Caller can not promote himself");
  });

  it("PromoteFreak fails when skill is not changed ", async function () {
    await freakTeamContractFromHr.promoteFreak(other.address, 2);
    expect((await FreakTeam.freaks(other.address)).skill).to.equal(2);
  });

  it("PromoteFreak fails when it doesn t emit an event ", async function () {
    await expect(freakTeamContractFromHr.promoteFreak(other.address, 2))
      .to.emit(FreakTeam, "promotedFreak")
      .withArgs(1, 1, 2);
  });
});
