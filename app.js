const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

// Прочитать
app.get('/', async (req, res) => {
    const query = await axios.get('http://localhost:3001/results');
    res.render('index', { hospital: query.data, myJson: JSON.stringify(query.data) });
});

// app.get('/lpu', async (req, res) => {
//     console.log('hi');
// });


app.listen(3000, () => {
  console.log('Listening on port 3000...');
});