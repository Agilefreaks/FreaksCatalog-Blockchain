const { expect, assert } = require("chai");
const EventEmitter = require('events');

describe("deleteFreakTests", function () {
  beforeEach(async() => {
    addFreak = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    freak = await addFreak.deploy(hr.address, financial.address);
  });

  it("DeleteFreak fails when it's not called by admin", async function () {
    await expect(freak.connect(other).deleteFreak(other.address)).to.be.revertedWith('Caller is not a hr');
  });


  it("DeleteFreak fails when caller try to remove himself", async function () {
    await expect(freak.connect(hr).deleteFreak(hr.address)).to.be.revertedWith('Caller can not remove himself');
  });
  
  it("DeleteFreak fails when balanceOf token is 0", async function () {
    await freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1);
    expect(await freak.balanceOf(
        other.address, (
            await freak.freaks(other.address)).employeeNumber))
            .to.not.equal(0);
  });

  it("DeleteFreak fails when when the function does not initialize the date of dismissal", async function () {
    await freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1);
    await freak.connect(hr).deleteFreak(other.address);
    expect((await freak.freaks(other.address)).stopDate).to.not.equal(0);
  });


  it("DeleteFreak fails when the delete function does not delete everything", async function () {
    await freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1);
    await freak.connect(hr).deleteFreak(other.address);
    expect(await freak.balanceOf(
      other.address, (
          await freak.freaks(other.address)).employeeNumber))
          .to.equal(0);
  });

  it("DeleteFreak fails when it doesn't burn amount", async function () {
    await freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1);
    await freak.connect(hr).deleteFreak(other.address);
    expect(await freak.balanceOf(
      other.address, (
          await freak.freaks(other.address)).employeeNumber))
          .to.equal(0);
  });
  
  it("DeleteFreak fails when it doesn t emit an event", async function () {
    await freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1);
    await(expect( freak.connect(hr).deleteFreak(other.address)).to.emit( 
            freak, "deletedFreak").withArgs(
              other.address, 1));
  });
  
});