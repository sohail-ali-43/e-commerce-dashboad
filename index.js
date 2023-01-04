const express = require('express');
const cors = require('cors');
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Products')





const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    //to remove password which shows everywhere
    result = result.toObject();
    delete result.password
    res.send(result);
});
app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select('-password')
        if (user) {
            res.send(user)
        } else {
            res.send({ result: 'no match found' })
        }
    } else {
        res.send({ result: 'no match found' })
    }

})
app.post('/add-product', async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result)
})

app.get('/products', async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    } else {
        res.send({ result: 'no products found....' })
    }
});
app.delete('/product/:id', async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id })//getting the id from params its means putting the id in url and getting the product according to id
        res.send(result);
});

app.get('/product/:id',async(req,res)=>{
    let result = await Product.findOne({_id: req.params.id});
    
    if(result){
        res.send(result)
    }else{
        res.send("no record found")
    }
      
    
})
app.put('/product/:id', async(req,res)=>{
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set : req.body
        }
    )
    res.send(result);
});

app.get('/search/:key' , async (req,res)=>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {price:{$regex:req.params.key}},
            {compony:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})


app.listen(5000);