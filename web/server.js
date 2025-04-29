const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`
========================================================
🌐 MetaMask Authentication Demo Server Running!
========================================================
🔗 Server: http://localhost:${PORT}
📁 Serving from: ${__dirname}
⚠️  Make sure to deploy your contract and update the 
   CONTRACT_ADDRESS in app.js before using the application.
========================================================
Press Ctrl+C to stop the server
`);
});
