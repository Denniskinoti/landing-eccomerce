var express = require('express');
const product = require('../model/products');
const Category = require('../model/category');
const fs = require('fs-extra')
var router = express.Router();

//view all the products in the product route

router.get('/produucts',(req,res)=> {
	product.find().then((products)=> {
		if(products) {
			req.flash('info','the product page')
			res.render('products/allProducts' ,{title:"products",product:products,message:req.flash('info')})
		}
	}).catch((error) => {
		throw error;
		console.log('error retrievin all products')
	})a
});

//view products as per the category
router.get('/category/:slug',(req,res)=> {
	const categorySlug = req.params.slug
	Category.findOne({slug:categorySlug},function(err,category) {
		product.find({category:categorySlug},(err,products)=> {
			if(err) {
				throw err
			}
			res.render('products/categoryProducts',{title:category.title,product:products})
		})
	})
})

//single product details
router.get('/:category/:product',(req,res)=> {
	var galleryImage = null;
	product.findOne({slug:req.params.product},(err,product)=> {
		if(err) {
			throw err
		}else {
			var galleryDir = 'public/productImage/' + product.id + '/gallery/';
			fs.readdir(galleryDir,(err,files)=> {
				if(err) {
					throw err
				}else {
					galleryImage = files;
					res.render('products/product',{title:product.title,gallery:galleryImage,product:product})
				}
			})
		}
	})
})




module.exports = router