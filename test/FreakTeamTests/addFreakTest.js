const { expect, assert } = require("chai");

describe("Add Freak -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    freak = await freakAccounts.deploy(hr.address, financial.address);
  });

  it("AddFreak fails when it's not called by hr", async function () {
    await expect(
      freak
        .connect(other)
        .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0)
    ).to.be.revertedWith("Caller is not a hr");
  });

  it("AddFreak fails when the name is not added", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0);
    expect((await freak.freaks(other.address)).name).to.equal("TestFreak");
  });

  it("AddFreak fails when the startDate is not added", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0);
    expect((await freak.freaks(other.address)).startDate).to.equal(2021);
  });

  it("AddFreak fails when employeeNumber is not added", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0);
    expect((await freak.freaks(other.address)).employeeNumber).to.equal(1);
  });

  it("AddFreak fails when role is not added", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 0, 1, 0);
    expect((await freak.freaks(other.address)).role).to.equal(0);
  });

  it("AddFreak fails when skill is not added", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 2, 0);
    expect((await freak.freaks(other.address)).skill).to.equal(2);
  });

  it("AddFreak fails if on the address already exists one freak", async function () {
    expect((await freak.freaks(other.address)).employeeNumber).to.equal(0);
  });

  it("AddFreak fails when mint doesn't modify Freak balance", async function () {
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0);
    expect(
      await freak.balanceOf(
        other.address,
        (
          await freak.freaks(other.address)
        ).employeeNumber
      )
    ).to.not.equal(0);
  });

  it("AddFreak fails when it doesn t emit an event", async function () {
    await expect(
      freak
        .connect(hr)
        .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0)
    )
      .to.emit(freak, "addedFreak")
      .withArgs(other.address, "TestFreak", 2021, 1, 1, 1, 0, 93);
  });
});
