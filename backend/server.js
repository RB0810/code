const WebSocket = require('ws');
const fs = require('fs');
const csv = require('csv-parser');

const wss = new WebSocket.Server({ port: 8080 });

let rows = [];
fs.createReadStream('data.csv') 
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', () => {
    console.log('CSV loaded with', rows.length, 'rows');
    
    wss.on('connection', (ws) => {
      console.log('Client connected');

      let i = 0;
      const interval = setInterval(() => {
        if (i < rows.length) {
          ws.send(JSON.stringify(rows[i]));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 1000); //1 second simulation delay
    });
});