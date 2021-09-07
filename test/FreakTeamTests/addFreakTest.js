const { expect, assert } = require("chai");
describe("Add Freak -- Tests", function () {
  beforeEach(async () => {
    FreakTeamContractFactory = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    FreakTeam = await FreakTeamContractFactory.deploy(
      hr.address,
      financial.address
    );
    freakTeamContractFromHr = await FreakTeam.connect(hr);
  });

  it("AddFreak fails when it's not called by hr", async function () {
    await expect(
      FreakTeam.connect(other).addNewFreak(
        other.address,
        "TestFreak",
        2021,
        1,
        1,
        1,
        0
      )
    ).to.be.revertedWith("Caller is not a hr");
  });

  it("AddFreak fails when the name is not added", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      1,
      0
    );
    expect((await FreakTeam.freaks(other.address)).name).to.equal("TestFreak");
  });

  it("AddFreak fails when the startDate is not added", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      1,
      0
    );
    expect((await FreakTeam.freaks(other.address)).startDate).to.equal(2021);
  });

  it("AddFreak fails when employeeNumber is not added", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      1,
      0
    );
    expect((await FreakTeam.freaks(other.address)).employeeNumber).to.equal(1);
  });

  it("AddFreak fails when role is not added", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      0,
      1,
      0
    );
    expect((await FreakTeam.freaks(other.address)).role).to.equal(0);
  });

  it("AddFreak fails when skill is not added", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      2,
      0
    );
    expect((await FreakTeam.freaks(other.address)).skill).to.equal(2);
  });

  it("AddFreak fails if on the address already exists one freak", async function () {
    expect((await FreakTeam.freaks(other.address)).employeeNumber).to.equal(0);
  });

  it("AddFreak fails when mint doesn't modify Freak balance", async function () {
    await freakTeamContractFromHr.addNewFreak(
      other.address,
      "TestFreak",
      2021,
      1,
      1,
      1,
      0
    );
    expect(
      await FreakTeam.balanceOf(
        other.address,
        (
          await FreakTeam.freaks(other.address)
        ).employeeNumber
      )
    ).to.not.equal(0);
  });

  it("AddFreak fails when it doesn t emit an event", async function () {
    await expect(
      freakTeamContractFromHr.addNewFreak(
        other.address,
        "TestFreak",
        2021,
        1,
        1,
        1,
        0
      )
    )
      .to.emit(FreakTeam, "addedFreak")
      .withArgs(other.address, "TestFreak", 2021, 1, 1, 1, 0, 93);
  });
});
