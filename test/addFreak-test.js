const { expect } = require("chai");

describe("addFreak", function () {

  beforeEach(async () => {
    [hr, financial, freak] = await ethers.getSigners();
    addFreak = await ethers.getContractFactory("Freaks");
    frk = await addFreak.deploy(hr.address, financial.address);
  });

  it("Should check if you have HR Role", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    await expect (frk.connect(financial).addFreak("Edi", 1, 1, 2021,1, freak.address)).to.be.revertedWith("Caller is not HR");
  });
  
  it("Should check if Freak id not already existing", async function () {
    expect((await frk.freakStruct(freak.address)).employeeNumber).to.equal(0);
  });
  
  it("Should check if Freak name was added", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021, 1,freak.address);
    expect((await frk.freakStruct(freak.address)).name).to.equal("Edi");
  });  

  it("Should check if Freak Role was added", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021, 1,freak.address);
    expect((await frk.freakStruct(freak.address)).rol).to.equal(1);  
  });

  it("Should check if Freak Skill was added", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021, 1,freak.address);
    expect((await frk.freakStruct(freak.address)).skill).to.equal(1); 
  });

  it("Should check if Freak startDate was added", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021, 1,freak.address);
    expect((await frk.freakStruct(freak.address)).startDate).to.equal(2021);
  });

  it("Should check if Freak employeeNumber was added", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021, 1,freak.address);
    expect((await frk.freakStruct(freak.address)).employeeNumber).to.equal(1); 
  });

  it("Should check if addedFreak event was emited", async function () {
    await expect(frk.connect(hr).addFreak("Edi",1,1,2021, 1, freak.address)).to.emit( 
      frk, "addedFreak").withArgs("Edi",1,1,2021,1,freak.address);
  });

  it("Should check if token was minted", async function () {
    await frk.connect(hr).addFreak("Edi",1,1,2021,1, freak.address);
    expect(await frk.balanceOf(freak.address, (await frk.freakStruct(freak.address)).employeeNumber)).to.equal(1);
  });

});
