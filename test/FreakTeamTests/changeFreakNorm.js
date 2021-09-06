const { expect, assert } = require("chai");

describe("Change Freak Norm -- Tests", function () {
  beforeEach(async () => {
    FreakTeamContractFactory = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    FreakTeam = await FreakTeamContractFactory.deploy(
      hr.address,
      financial.address
    );
    freakTeamContractFromHr = await FreakTeam.connect(hr);
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      1,
      0
    );
  });

  it("ChangeFreakNorm fails when it's not called by hr", async function () {
    await expect(
      FreakTeam.connect(other).changeFreakNorm(other.address, 1)
    ).to.be.revertedWith("Caller is not a hr");
  });

  it("ChangeFreakNorm fails when caller try to promote himself", async function () {
    await expect(
      freakTeamContractFromHr.changeFreakNorm(hr.address, 1)
    ).to.be.revertedWith("Caller can not promote himself");
  });

  it("ChangeFreakNorm fails when norm is not changed ", async function () {
    await freakTeamContractFromHr.changeFreakNorm(other.address, 1);
    expect((await FreakTeam.freaks(other.address)).norm).to.equal(1);
  });

  it("ChangeFreakNorm fails when it doesn t emit an event ", async function () {
    await expect(freakTeamContractFromHr.changeFreakNorm(other.address, 1))
      .to.emit(FreakTeam, "changedFreakNorm")
      .withArgs(1, 0, 1);
  });
});
