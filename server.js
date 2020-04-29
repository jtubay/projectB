if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);


const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.render('store.ejs')
// });

// app.get('/test', (req, res) => {
//     res.render('test.ejs')
// });
// app.post('/charge', (req, res) => {
//     const amount = 5500;
    
//     stripe.customers.create({
//       email: req.body.stripeEmail,
//       source: req.body.stripeToken
//     })
//     .then(customer => stripe.charges.create({
//       amount,
//       description: 'Web Development Ebook',
//       currency: 'usd',
//       customer: customer.id
//     }))
//     .then(charge => res.render('purchase.ejs'));
// });
app.get('/store', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if(error){
            res.status(500).end()
        }else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})
app.get('/', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if(error){
            res.status(500).end()
        }else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})


app.listen(PORT, () => console.log(`SERVER STARTED AT https://http://localhost:${PORT}`))
