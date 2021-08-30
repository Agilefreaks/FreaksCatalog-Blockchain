var chai = require("chai");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
chai.use(require("chai-bignumber")(BigNumber));
var web3 = require("web3");
const toBN = web3.utils.toBN;

describe("Get Freaks -- Tests", function () {
  beforeEach(async () => {
    freakAccounts = await ethers.getContractFactory("FreakTeam");
    [admin, hr, other, financial] = await ethers.getSigners();
    freak = await freakAccounts.deploy(hr.address, financial.address);
    await freak
      .connect(hr)
      .addNewFreak(other.address, "TestFreak", 2021, 1, 1, 1, 0);
    await freak
      .connect(hr)
      .addNewFreak(hr.address, "TestFreak1", 2021, 2, 1, 1, 0);
    await freak
      .connect(hr)
      .addNewFreak(admin.address, "TestFreak2", 2021, 3, 1, 1, 1);
  });

  it("getFreaks fails when it doesn't return corect names", async function () {
    let [names] = await freak.getFreaks();
    expect(names).to.eql(["TestFreak", "TestFreak1", "TestFreak2"]);
  });
  it("getFreaks fails when it doesn't return corect roles", async function () {
    let [names, roles] = await freak.getFreaks();
    expect(roles).to.eql([
      (await freak.freaks(other.address)).role,
      (await freak.freaks(hr.address)).role,
      (await freak.freaks(admin.address)).role,
    ]);
  });
  it("getFreaks fails when it doesn't return corect skills", async function () {
    let [names, roles, skills] = await freak.getFreaks();
    expect(skills).to.eql([
      (await freak.freaks(other.address)).skill,
      (await freak.freaks(hr.address)).skill,
      (await freak.freaks(admin.address)).skill,
    ]);
  });
  it("getFreaks fails when it doesn't return corect norm", async function () {
    let [names, roles, skills, norms] = await freak.getFreaks();
    expect(norms).to.eql([
      (await freak.freaks(other.address)).norm,
      (await freak.freaks(hr.address)).norm,
      (await freak.freaks(admin.address)).norm,
    ]);
  });
  it("getFreaks fails when it doesn't return corect startDates", async function () {
    let [names, roles, skills, norms, startDates] = await freak.getFreaks();
    expect(startDates).to.eql([
      BigNumber.from((await freak.freaks(other.address)).startDate),
      BigNumber.from((await freak.freaks(hr.address)).startDate),
      BigNumber.from((await freak.freaks(admin.address)).startDate),
    ]);
  });
  it("getFreaks fails when it doesn't return corect address", async function () {
    let [names, roles, skills, norms, startDates, addresses] =
      await freak.getFreaks();
    expect(addresses).to.eql([other.address, hr.address, admin.address]);
  });
  it("getFreaks fails when it doesn't return corect scores", async function () {
    let [names, roles, skills, norms, startDates, addresses, scores] =
      await freak.getFreaks();
    expect(scores).to.eql([
      (await freak.freaks(other.address)).score,
      (await freak.freaks(hr.address)).score,
      (await freak.freaks(admin.address)).score,
    ]);
  });
});
