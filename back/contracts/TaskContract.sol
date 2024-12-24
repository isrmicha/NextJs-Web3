// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract TaskContract {
    event AddTask(address recipient, uint taskId, bool winner);

    struct Task {
        uint id;
        address username;
        string taskText;
        bool winner;
    }

    Task[] private tasks;

    // Mapping of Game id to the wallet address of the user
    mapping(uint256 => address) taskToOwner;

    // Method to be called by our frontend when trying to add a new Game
    function addTask(string memory taskText, bool winner) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, msg.sender, taskText, winner));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId, winner);
    }

    // Method to get only your Games
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
}
