const { expect } = require("chai");

describe("removeFreak", function () {

  beforeEach(async () => {
    [owner,hr, financial, freak] = await ethers.getSigners();
    addFreak = await ethers.getContractFactory("Freaks");
    frk = await addFreak.deploy(hr.address, financial.address);
  });

  it("Should check if you have HR Role", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await frk.connect(hr).removeFreak(freak.address);
    await expect (frk.connect(financial).removeFreak(freak.address)).to.be.revertedWith("Caller is not HR");
  });

  it("Should check if address has one token", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    expect (await frk.balanceOf(freak.address, (await frk.freakStruct(freak.address)).employeeNumber)).to.equal(1);
  });

  it("Should check if token was burnt", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await frk.connect(hr).removeFreak(freak.address);
    expect (await frk.balanceOf(freak.address, (await frk.freakStruct(freak.address)).employeeNumber)).to.equal(0);
  });

  it("Should check that stopDate exists", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await frk.connect(hr).removeFreak(freak.address);
    expect((await frk.freakStruct(freak.address)).stopDate).to.not.be.equal(0);
  });

  it("Should emit event at removal", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await expect(frk.connect(hr).removeFreak(freak.address)).to.emit(frk, "removedFreak").withArgs(freak.address, 1);
  });
});