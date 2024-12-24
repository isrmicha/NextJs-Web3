const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task Contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;

  let totalTasks;

  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];

    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskText: "Task number:- " + i,
        winner: false,
        reward: 10,
      };

      await taskContract.addTask(task.taskText, task.winner, 10);
      totalTasks.push(task);
    }
  });

  describe("Add Task", function () {
    it("should emit AddTask event", async function () {
      let task = {
        taskText: "New Task",
        winner: false,
      };

      await expect(await taskContract.addTask(task.taskText, task.winner, 10))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS, task.winner, 10);
    });
  });

  describe("Get All Tasks", function () {
    it("should return the correct number of total tasks", async function () {
      const tasksFromChain = await taskContract.getMyTasks();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS);
    });
  });
  describe("Get my balance", function () {
    it("should return the correct number of total balance", async function () {
      const balance = await taskContract.myBalance();
      expect(balance).to.equal(50);
    });
  });
});
