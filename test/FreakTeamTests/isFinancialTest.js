const { expect, assert } = require("chai");

describe("Delete Freak -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    freak = await freakAccounts.deploy(hr.address, financial.address);
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 1);
  });

  it("Is financial fails when it's not called by financial", async function () {
    await expect(freak.connect(other).isFinancial()).to.be.revertedWith(
      "Caller is not a financial"
    );
  });
  it("AddFreak fails when skill is not added", async function () {
    expect(await freak.connect(financial).isFinancial()).to.equal(true);
  });
});
