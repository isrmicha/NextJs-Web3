require("dotenv").config();
const { ethers } = require("hardhat");

const main = async () => {
  let contract, contractFactory;
  try {
    contractFactory = await ethers.getContractFactory("TaskContract");
  } catch (error) {
    console.log(1);
    console.log(error);
    process.exit(1);
  }
  try {
    contract = await contractFactory.deploy();
  } catch (error) {
    console.log(2);
    console.log(error);
    process.exit(1);
  }

  await contract.deployed();

  console.log("Contract deployed to: ", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
