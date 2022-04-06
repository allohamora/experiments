// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public count = 0;

  struct Todo {
    uint id;
    string content;
    bool isCompleted;
  }

  mapping(uint => Todo) public todos;

  event TodoCreated (
    uint id,
    string content,
    bool isCompleted
  );

  function createTodo(string memory _content) public {
    count++;
    todos[count] = Todo(count, _content, false);
    emit TodoCreated(count, _content, false);
  }

  event TodoCompleted (
    uint id
  );

  function completeTodo(uint _id) public {
    Todo memory _todo = todos[_id];
    _todo.isCompleted = true;
    todos[_id] = _todo;
    emit TodoCompleted(_todo.id);
  }

  event TodoUpdated (
    uint id,
    string content,
    bool isCompleted
  );

  function updateTodo(uint _id, string memory _content) public {
    Todo memory _todo = todos[_id];
    _todo.content = _content;
    emit TodoUpdated(_id, _content, _todo.isCompleted);
  }

  event TodoDeleted (
    uint id
  );

  function deleteTodo(uint _id) public {
    delete todos[_id];
    emit TodoDeleted(_id);
  }

  function getTodos() public view returns(Todo[] memory) {
    Todo[] memory _todos = new Todo[](count);

    for (uint i = 0; i < count; i++) {
      Todo memory _todo = todos[i + 1];
      _todos[i] = _todo;
    }

    return _todos;
  }
}