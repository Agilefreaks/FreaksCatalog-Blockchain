const { expect } = require("chai");
const { ethers } = require("hardhat");
const { artifacts } = require("hardhat");

describe("FreakTeam", function () {
  it("Add a new freak fails when it's not called by a hr", async function () {


    const addFreak = await ethers.getContractFactory("FreakTeam");
    const [admin, hr, other, financial] = await ethers.getSigners();
    const freak = await addFreak.deploy(hr.address, financial.address);
    await expect(freak.connect(hr).addNewFreak(other.address,"TestFreak",2021,1,1,1)).to.be.revertedWith('-----Not a hr account')

  })
})