// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public count = 0;

  struct Task {
    uint id;
    string title;
    string body;
    bool isCompleted;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated (
    uint id,
    string title,
    string body,
    bool isCompleted
  );

  function createTask(string memory _title, string memory _body) public {
    count++;
    tasks[count] = Task(count, _title, _body, false);
    emit TaskCreated(count, _title, _body, false);
  }

  event TaskCompleted (
    uint id
  );

  function completeTask(uint _id) public {
    Task memory _task = tasks[_id];
    _task.isCompleted = true;
    tasks[_id] = _task;
    emit TaskCompleted(_task.id);
  }

  event TaskUpdated (
    uint id,
    string title,
    string body,
    bool isCompleted
  );

  function updateTask(uint _id, string memory _title, string memory _body) public {
    Task memory _task = tasks[_id];
    _task.title = _title;
    _task.body = _body;
    emit TaskUpdated(_id, _title, _body, _task.isCompleted);
  }
}