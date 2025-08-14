# Event Loop
Event loops is a way to handle asynchronous operations in a program. It is a loop that checks one macro task and all micro tasks until there are no more tasks to execute.

## Microtasks and Macrotasks
The Event Loop has one queue for all microtasks (PromiseJobs or "microtask queue" - v8 term) and another for all macrotasks. Since all ready microtasks are executed before moving on to the next macrotask, a large backlog of microtasks can completely block the Event Loop.