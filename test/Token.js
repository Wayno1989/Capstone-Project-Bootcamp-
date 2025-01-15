const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, accounts, deployer, receiver;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Wayne Token", "WAYT", "1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
  });

  describe("Deployment", () => {
    const name = "Wayne Token";
    const symbol = "WAYT";
    const decimals = "18";
    const totalSupply = tokens("1000000");

    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("assigns total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("Sending Tokens", () => {
    let amount;

    it("Transfers token balances", async () => {
      //transfer tokens

      amount = tokens(100);
      let transaction = await token
        .connect(deployer)
        .transfer(receiver.address, amount);
      let result = transaction.wait();

      // ensure tokens were transfered (balance changed)
      expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
      expect(await token.balanceOf(receiver.address)).to.equal(amount);
    });
  });
});
