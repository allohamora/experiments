const http = require('http');
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;

// set round robin shedule to cluster
cluster.schedulingPolicy = cluster.SCHED_RR;

const PORT = 8000;

const STATUSCODE = {
  OK: 200,
};

const server = http.createServer((req, res) => {
  res.writeHead(STATUSCODE.OK);
  res.end(`Hello from worker ${process.pid}`);
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen(PORT);
  console.log(`Worker ${process.pid} is running`);
}
