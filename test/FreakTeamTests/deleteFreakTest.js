const { expect, assert } = require("chai");

describe("Delete Freak -- Tests", function () {
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

  it("DeleteFreak fails when it's not called by admin", async function () {
    await expect(
      FreakTeam.connect(other).deleteFreak(other.address)
    ).to.be.revertedWith("Caller is not a hr");
  });

  it("DeleteFreak fails when caller try to remove himself", async function () {
    await expect(freakTeamContractFromHr.deleteFreak(hr.address)).to.be.revertedWith(
      "Caller can not remove himself"
    );
  });

  it("DeleteFreak fails when balanceOf token is 0", async function () {
    expect(
      await FreakTeam.balanceOf(
        other.address,
        (
          await FreakTeam.freaks(other.address)
        ).employeeNumber
      )
    ).to.not.equal(0);
  });

  it("DeleteFreak fails when when the function does not initialize the date of dismissal", async function () {
    await freakTeamContractFromHr.deleteFreak(other.address);
    expect((await FreakTeam.freaks(other.address)).stopDate).to.not.equal(0);
  });

  it("DeleteFreak fails when the delete function does not delete everything", async function () {
    await freakTeamContractFromHr.deleteFreak(other.address);
    expect(
      await FreakTeam.balanceOf(
        other.address,
        (
          await FreakTeam.freaks(other.address)
        ).employeeNumber
      )
    ).to.equal(0);
  });

  it("DeleteFreak fails when it doesn't burn amount", async function () {
    await freakTeamContractFromHr.deleteFreak(other.address);
    expect(
      await FreakTeam.balanceOf(
        other.address,
        (
          await FreakTeam.freaks(other.address)
        ).employeeNumber
      )
    ).to.equal(0);
  });

  it("DeleteFreak fails when it doesn t emit an event", async function () {
    await expect(freakTeamContractFromHr.deleteFreak(other.address))
      .to.emit(FreakTeam, "deletedFreak")
      .withArgs(other.address, 1);
  });
});
