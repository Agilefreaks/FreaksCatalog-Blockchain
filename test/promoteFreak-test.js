const { expect } = require("chai");

describe("promoteFreak", function () {

  beforeEach(async () => {
    [owner,hr, financial, freak] = await ethers.getSigners();
    addFreak = await ethers.getContractFactory("Freaks");
    frk = await addFreak.deploy(hr.address, financial.address);
  });

  it("Should check if you have HR Role", async function () {
    await frk.connect(hr).addFreak("Edi", 1, 1, 2021, 1, freak.address);
    await frk.connect(hr).promoteFreak(freak.address, 2);
    await expect (frk.connect(financial).promoteFreak(freak.address, 2)).to.be.revertedWith("Caller is not HR");
  });

  it("Should check if Freak exists", async function () {
    await frk.connect(hr).addFreak("Edi", 1, 1, 2021, 1, freak.address);
    expect((await frk.freakStruct(freak.address)).employeeNumber).to.equal(1); 
  });

  it("Should check if new Skill is better then the old one", async function () {
    await frk.connect(hr).addFreak("Edi", 1, 1, 2021, 2, freak.address);
    await expect (frk.connect(hr).promoteFreak(freak.address, 1)).to.be.revertedWith("Noul skill trebuie sa fie mai bun ca cel vechi"); 
    await frk.connect(hr).promoteFreak(freak.address, 3);
  });

  it("Should emit event when Freak promoted", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await expect(frk.connect(hr).promoteFreak(freak.address, 3)).to.emit(frk, "freakPromoted").withArgs((await frk.freakStruct(freak.address)).employeeNumber, 1, 3);
  });

});