const express = require('express');
const Product = require('../model/products')
const router = express.Router();

//adding product to cart
router.get('/add/:product',(req,res)=> {

	const slug = req.params.product

	Product.findOne({slug:slug},(err,product)=> {
		if(err) {
			throw err
		}
		if(typeof req.session.cart == "undefined") {
			req.session.cart = [];
			req.session.cart.push({
				title:slug,
				qty: 1,
				price:parseFloat(product.price).toFixed(2),
				image:'/producImage' + product.id + "/" + product.image
			})
			cart = req.session.cart
		}else {
			var cart = req.session.cart;
			var newItem = true;

			for (var i; i<cart.length; i++) {
				if(cart[i].title == slug) {
					cart[i].qty++;
					newItem = false;
					break;
				}
			}

			if(newItem) {
				cart.push({
					title:slug,
					qty: 1,
					price:parseFloat(product.price).toFixed(2),
					image:'/productImage/' + product.id + '/' + product.image
				})

				
			}
			

		}
		
		console.log('check cart',cart)
	
		
		console.log('this is the reqsessioncar',req.session.cart)
		console.log('this is the cart',cart)
		res.redirect('back')

	})
})


module.exports = router