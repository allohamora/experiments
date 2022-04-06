const login = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);

    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('User denied account access');
    }
  }

  // Legacy dapp browsers...
  // else if (typeof window.web3 !== 'undefined') {
  //   window.web3 = new Web3(web3.currentProvider)
  // }

  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

const testNetwork = {
  chainId: '0x539',
  chainName: 'Localhost 8545', // e.g. 'Todo List Test'
  rpcUrls: ['http://127.0.0.1:8545/'], // doesn't works with http, only with https
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: null,
};

const network = testNetwork;

const addNetwork = async () => {
  // way to add new network, but doesn't work via http :(
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [network],
  });
};

const setNetwork = async () => {
  // can't swith to test network 06.04.2022
  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: network.chainId }] });
  } catch (error) {
    // network doesn't exists
    if (error.code === 4902) {
      await addNetwork();
    }

    throw error;
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });

  if (chainId !== network.chainId) {
    alert(`Manualy change network to ${network.chainName}`);
  }
};

let account;

const setAccount = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
};

const checkNetwork = (openApp) => async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });

  if (chainId !== network.chainId) {
    alert(`set ${network.chainName} network`);
  } else {
    await setAccount();

    openApp();
  }
};

const app = document.querySelector('.app');

const loginButton = app.querySelector('.login');
loginButton.addEventListener('click', login);

const setNetworkButton = app.querySelector('.set-network');
setNetworkButton.addEventListener('click', setNetwork);

const todos = app.querySelector('.todos');
const todosList = todos.querySelector('.todos__list');

let TodoList;

const setTodoListContract = async () => {
  const TodoListJson = await fetch('../build/contracts/TodoList.json').then((res) => res.json());
  const TodoListContract = window.TruffleContract(TodoListJson);

  TodoListContract.setProvider(window.web3.currentProvider);
  TodoListContract.defaults({
    from: account,
  });

  TodoList = await TodoListContract.deployed();
};

const renderTodos = async () => {
  const {
    words: [count],
  } = await TodoList.count();
  const todos = await Promise.all(Array.from({ length: count }, (_, i) => TodoList.todos(i + 1)));

  todosList.innerHTML = '';
  todos.forEach(
    ({
      content,
      isCompleted,
      id: {
        words: [id],
      },
    }) => {
      if (content === '') {
        return;
      }

      todosList.insertAdjacentHTML('afterbegin', `<div>${id}. ${content} (${isCompleted ? 'V' : 'X'})</div>`);
    },
  );

  if (todos.length === 0) {
    todosList.innerHTML = 'Nothing added';
  }
};

const openApp = async () => {
  await setTodoListContract();
  await renderTodos();

  todos.classList.add('todos--active');
};

const checkNetworkButton = app.querySelector('.check-network');
checkNetworkButton.addEventListener('click', checkNetwork(openApp));

const createTodo = async () => {
  const content = prompt('enter todo content', 'unknown content');

  await TodoList.createTodo(content);
  await renderTodos();
};

const createTodoButton = todos.querySelector('.create-todo');
createTodoButton.addEventListener('click', createTodo);

const promptTodo = async () => {
  const id = prompt('enter id', 0);

  const todo = await TodoList.todos(id);
  const msg = `todo with id: ${id} not found`;

  if (todo.content === '') {
    alert(msg);
    throw new Error(msg);
  }

  return todo;
};

const updateTodo = async () => {
  const todo = await promptTodo();
  const content = prompt('enter new content', todo.content);

  await TodoList.updateTodo(id, content);
  await renderTodos();
};

const updateTodoButton = todos.querySelector('.update-todo');
updateTodoButton.addEventListener('click', updateTodo);

const completeTodo = async () => {
  const todo = await promptTodo();

  if (todo.isCompleted) {
    alert(`todo already completed`);
    return;
  }

  await TodoList.completeTodo(todo.id);
  await renderTodos();
};

const completeTodoButton = todos.querySelector('.complete-todo');
completeTodoButton.addEventListener('click', completeTodo);

const deleteTodo = async () => {
  const todo = await promptTodo();

  await TodoList.deleteTodo(todo.id);
  await renderTodos();
};

const deleteTodoButton = todos.querySelector('.delete-todo');
deleteTodoButton.addEventListener('click', deleteTodo);
