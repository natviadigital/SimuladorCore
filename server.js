const express = require('express');
const path = require('path');
const { costData } = require('./data/costData');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', (req, res) => {
  res.json(costData);
});

app.listen(PORT, () => {
  console.log(`\n🔌 Transformer Cost Dashboard running at http://localhost:${PORT}\n`);
});
