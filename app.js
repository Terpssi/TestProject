const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

// Прочитать json
app.get('/', async (req, res) => {
    const query = await axios.get('http://localhost:3001/results');
    res.render('index', {myJson: JSON.stringify(query.data) });
});


app.listen(3000, () => {
  console.log('Listening on port 3000...');
});