const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('store.ejs')
})
app.get('/test', (req, res) => {
    res.render('test.ejs')
})


app.listen(PORT, () => console.log(`SERVER STARTED AT https://http://localhost:${PORT}`))
