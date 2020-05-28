
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
console.log(stripeSecretKey, stripePublicKey);

const express = require('express');
const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);

const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/store', (req, res) => {
    fs.readFile('items.json', (error, data)=>{
        if(error){
            res.status(500).end()
        } else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
                
            })
        }
            
    })
});

app.post('/purchase', (req, res) => {
    fs.readFile('items.json', (error, data)=>{
        if(error){
            res.status(500).end()
        } else{
            const itemsJson = JSON.parse(data);
            const itemsArray = itemsJson.music.concat(itemsJson.merch);
            let total = 0;
            req.body.items.forEach((item)=>{
                const itemJson = itemsArray.find((i)=>{
                    return i.id == item.id;
                    
                })
                total = total + itemJson.price * item.quantity;
            })
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(()=>{
                console.log('chargesucessfull <==========')
                res.json({ message: 'Successfully purchased items' })
            }).catch(()=>{
                console.log('charrge failed')
                res.status(500).end()
            })

        }
            
    })
});



app.listen(PORT, () => console.log(`SERVER STARTED AT http://localhost:${PORT}/store`))