var chai = require("chai");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
var web3 = require("web3");
const toBN = web3.utils.toBN;

describe("Get Freaks -- Tests", function () {
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
    await freakTeamContractFromHr.addNewFreak(
      hr.address,
      "TestFreak1",
      2021,
      2,
      1,
      1,
      0
    );
    await freakTeamContractFromHr.addNewFreak(
      admin.address,
      "TestFreak2",
      2021,
      3,
      1,
      1,
      1
    );
  });

  it("getFreaks fails when it doesn't return corect things", async function () {
    let [names, roles, skills, norms, startDates, addresses, scores] =
      await FreakTeam.getFreaks();
    expect(names).to.eql(["TestFreak", "TestFreak1", "TestFreak2"]);
    expect(roles).to.eql([
      (await FreakTeam.freaks(other.address)).role,
      (await FreakTeam.freaks(hr.address)).role,
      (await FreakTeam.freaks(admin.address)).role,
    ]);
    expect(skills).to.eql([
      (await FreakTeam.freaks(other.address)).skill,
      (await FreakTeam.freaks(hr.address)).skill,
      (await FreakTeam.freaks(admin.address)).skill,
    ]);
    expect(norms).to.eql([
      (await FreakTeam.freaks(other.address)).norm,
      (await FreakTeam.freaks(hr.address)).norm,
      (await FreakTeam.freaks(admin.address)).norm,
    ]);
    expect(startDates).to.eql([
      BigNumber.from((await FreakTeam.freaks(other.address)).startDate),
      BigNumber.from((await FreakTeam.freaks(hr.address)).startDate),
      BigNumber.from((await FreakTeam.freaks(admin.address)).startDate),
    ]);
    expect(addresses).to.eql([other.address, hr.address, admin.address]);
    expect(scores).to.eql([
      (await FreakTeam.freaks(other.address)).score,
      (await FreakTeam.freaks(hr.address)).score,
      (await FreakTeam.freaks(admin.address)).score,
    ]);
  });
});
