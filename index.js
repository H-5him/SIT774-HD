// The package for the web server
const express = require('express');
// Additional package for logging of HTTP requests/responses
const morgan = require('morgan');
// additional package for mongoDB
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');
// reference to MongoDB database
const product = require('./models/product');
// MongoDB connection
const db = 'mongodb+srv://hashimplay1:oQToWFBhJcLWdlRx@productcluster.frzop.mongodb.net/productDB?retryWrites=true&w=majority&appName=Productcluster'
// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MongoDB connection successful');
// Include the logging for all requests
app.use(morgan('common'));
app.use(express.static('public_html'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {

   //fetch products from the database
   const products = await product.find();
   if (products) {
      res.render('index', { title: 'dKin Product Management', products: products });
   } else {
      res.status(500).json({ message: err.message });
   }
});

// Adding new product to the database
app.post('/addproduct', (req, res, next) => {
   let name = req.body.productname;
   let amount = req.body.price;
   let qty = req.body.quantity;

   // creating new product with the extracted fields.
   const item = new product({
      productname: name,
      price: amount,
      stock: qty
   })
   // saving the items in the database
   item.save();
   res.redirect('/')
});

// deleting a data
app.post('/deleteproduct', async (req, res, next) => {

   const removeitem = req.body.name;
   const deleteitem = await product.findOneAndDelete({ productname: removeitem });
   if (deleteitem) {
      res.redirect('/');
   } else {
      res.status(404).send('Error Deleting the data')
   }
});

// updating the data
app.post('/updateproduct', async (req, res, next) => {

   const edititem = req.body.name;
   const newprice = req.body.price;
   const newqty = req.body.qty;
   const updateitem = await product.findOneAndUpdate({ productname: edititem }, { price: newprice, stock: newqty }, { new: true })

   if (updateitem) {
      res.redirect('/');
   } else {
      res.status(404).send('Error Updating the data')
   }
});

app.use((error, request, response, next) => {
   let errorStatus = error.status || 500;
   response.status(errorStatus);
   response.send('<h2><strong>ERROR(' + errorStatus + '): ' + error.toString() + '</strong></h2>');
});

app.listen(port, () => {
   // When the application starts, print to the console that our app is
   // running at http://localhost:3000. Print another message indicating
   // how to shut the server down.
   console.log(`Web server running at: http://localhost:${port}`);
   console.log(`Type Ctrl+C to shut down the web server`);
})