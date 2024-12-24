// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract TaskContract {
    event AddTask(address recipient, uint taskId, bool winner, uint reward);

    struct Task {
        uint id;
        address username;
        string taskText;
        bool winner;
        uint reward;
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    function addTask(
        string memory taskText,
        bool winner,
        uint reward
    ) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, msg.sender, taskText, winner, reward));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId, winner, reward);
    }

    function getMyTasks() external view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function myBalance() external view returns (uint balance) {
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].username == msg.sender) {
                balance += tasks[i].reward;
            }
        }

        return balance;
    }
}
