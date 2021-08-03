const { expect, assert } = require("chai");

describe("listFreaks", function () {
  beforeEach(async() => {
    freakAccounts = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other] = await ethers.getSigners();
    freak = await freakAccounts.deploy(hr.address);
    await freak.connect(hr).addNewFreak(other.address, "TestFreak1", 2018, 0, 1, 1);
    await freak.connect(hr).addNewFreak(hr.address, "TestFreak2", 2015, 2, 1, 1);
    await freak.connect(hr).addNewFreak(admin.address, "TestFreak3", 2014, 3, 1, 1);
  });

  it("listShare fails when it's not called by hr", async function () {
    await expect(freak.connect(other).calculateShare(2014, 2015)).to.be.revertedWith('Caller is not hr');
  });

  it("listShare fails when it does not calculate the share correctly", async function () {
    await freak.connect(hr).calculateShare(2014, 2015);
    expect(await freak.freakShare(other.address)).to.equal(68);
    expect(await freak.freakShare(hr.address)).to.equal(68);
    expect(await freak.freakShare(admin.address)).to.equal(93);
  });

  it("listShare fails when it does not emit the events correctly", async function () {
    await(expect( freak.connect(hr).calculateShare(2014, 2015))).to.emit(freak, "listedFreak").
    withArgs((await freak.freaks(other.address)).name, (await freak.freaks(other.address)).role,
    (await freak.freaks(other.address)).skill, (await freak.freaks(other.address)).startDate, other.address, (await freak.freakShare(other.address)));

    await(expect( freak.connect(hr).calculateShare(2014, 2015))).to.emit(freak, "listedFreak").
    withArgs((await freak.freaks(hr.address)).name, (await freak.freaks(hr.address)).role,
    (await freak.freaks(hr.address)).skill, (await freak.freaks(hr.address)).startDate, hr.address, (await freak.freakShare(hr.address)));

    await(expect( freak.connect(hr).calculateShare(2014, 2015))).to.emit(freak, "listedFreak").
    withArgs((await freak.freaks(admin.address)).name, (await freak.freaks(admin.address)).role,
    (await freak.freaks(admin.address)).skill, (await freak.freaks(admin.address)).startDate, admin.address, (await freak.freakShare(admin.address)));

  });
}); 