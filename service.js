// services.js
const { Service } = require('node-windows');

// --- FRONTEND SERVICE ---
const front = new Service({
  name: 'Frontend',
  description: 'Next.js frontend server',
  script: 'frontend\\.next\\standalone\\server.js',
});

front.on('install', () => {
  front.start();
  console.log('Frontend service installed and started!');
});

// --- BACKEND SERVICE ---
const back = new Service({
  name: 'Backend',
  description: 'Node.js backend server',
  script: 'backend\\dist\\app.js',
});

back.on('install', () => {
  back.start();
  console.log('Backend service installed and started!');
});

// --- WEBSOCKET SERVICE ---
const ws = new Service({
  name: 'WebSocket',
  description: 'WebSocket server',
  script: 'websocket\\server.js',
});

ws.on('install', () => {
  ws.start();
  console.log('WebSocket service installed and started!');
});

// Install all services
front.install();
back.install();
ws.install();
