(async () => {
  const CONTRACT_NAME = "TaskContract";
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  const contract = await ethers.getContractAt(CONTRACT_NAME, CONTRACT_ADDRESS);
  //   console.log(await contract.addTask("rock", true));
  //   console.log(await contract.addTask("paper", true));
  //   console.log(await contract.addTask("scissor", true));
  //   console.log(await contract.addTask("rock", false));
  //   console.log(await contract.addTask("rock", false));
  console.log(await contract.getMyTasks());
})();
