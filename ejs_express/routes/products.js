const express = require('express');
const Product = require('../model/products')
const Category = require('../model/category')
const path = require('path')
var mv = require('mv')

const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const resizeImg = require('resize-img')


const router = express.Router();



router.get('/products',(req,res)=> {
	var count ;

	Product.count((err,c)=> {
		count = 0
	})

	Product.find((err,products)=> {
		req.flash('info','this is the products page')
		res.render('admin/products',{product:products,count:count,message:req.flash('info')})
	})
	
})

//get new product route
router.get('/newProduct',(req,res)=> {
	var title = "";
	var description = "";
	var price = "";

	Category.find((err,category)=> {
		if(err) {
			throw err
		}
		req.flash('info',"this is the add product page")
		res.render('admin/add_product',{
			title : title,
			description:description,
			price: price,
			category:category,
			message:req.flash('info')
		})

	})

});

//creating a new product
router.post('/addProduct',(req,res)=> {	
			var imageFile;				
			if(!req.files) {
					 // res.send({
      //           status: false,
      //           message: 'No file uploaded'
      //       });	
      			imageFile = "";			
			}else {
				imageFile = req.files.image.name
				var imagefil = req.files.image
			}

				//var imageFile = typeof req.files.image != "undefined" ? req.files.image.name:"";
				req.checkBody('image','you must upload an image').isImage(imageFile)				
				req.checkBody('title','title cannot be empty').notEmpty()
				req.checkBody('description','content cannot be empty').notEmpty()
				req.checkBody('price','price cannot be empty').notEmpty()
			

				const title = req.body.title;
				const slug = title.replace(/\s+/g,'-').toLowerCase();
				var description = req.body.description;
				var price = req.body.price;
				var category = req.body.category;
				
				var errors = req.validationErrors();				
				if(errors) {
					Category.find((err,category)=> {
						if(err) {
							throw err
						}
						var messages = [];
						errors.forEach(function(error) {
							messages.push(error.msg)
						})
						req.flash('error',messages)
						res.render('admin/add_product',{messages:req.flash('error'),title:title,description:description,price:price,category:category})
					})
				}

				Product.findOne({slug:slug},(err,product)=> {
					if(product) {
						req.flash('error','product exists');
						Category.find((err,category)=> {
							res.render('admin/add_product',{messages:req.flash('error'),title:title,description:description,category:category,price:price});
						})
						
					}else {
						var price3 = parseInt(price).toFixed(2);
					const products = new Product({
						title:title,
						description: description,
						slug: slug,
						price: price3,
						category:category,
						image:imageFile
				});

				products.save().then((product)=> {
					if(product) {
						req.flash('info','successfully created')				

						mkdirp('public/productImage/' + product.id).then(made =>
  							console.log(`made directories, starting with ${made}`))

						mkdirp('public/productImage/' + product.id + '/gallery').then(made =>
  							console.log(`made directories, starting with ${made}`))

						mkdirp('public/productImage/' + product.id + '/gallery/thumbs').then(made =>
  							console.log(`made directories, starting with ${made}`));						

						if(imageFile !="") {
							
							let productImage = req.files.image
							console.log('the image is:',productImage)
							var path = 'public/productImage/' + product.id + '/'  + imageFile

							productImage.mv(path,(err)=> {
								return console.log(err)
							})
						}
						
						req.flash('info','product added');
						res.redirect('/products/products')
					
							}
					}).catch((error)=> {
						throw error
							})

					}
				})						
			
		})

//get edit page
router.get('/edit/:id',(req,res)=> {
	
	var errors;
	if(req.session.errors) errors =req.session.errors;
	req.session.errors = null;

	Category.find((err,categoris)=> {
		Product.findById(req.params.id,(err,product)=> {
			if(err) {
				throw err
			}else {
			const galleryDir = 'public/productImage/' + product.id + '/gallery';
			var galleryImages = null;

			fs.readdir(galleryDir,function(err,files) {
				if(err) {
					throw err
				}else {
					galleryImages = files;

					res.render('admin/edit_product',{
						title: product.title,
						description:product.description,
						categories:categoris,
						category:product.category.replace(/\s+/g,'-').toLowerCase(),
						price: product.price,
						image:product.image,
						galleryImages: galleryImages,
						id:req.params.id

					})
				}
			})
			}
		})
		
		
		

	})
})


router.post('/editProduct/:id',(req,res)=> {
	var imageFile;				
			if(!req.files) {
					 res.send({
                status: false,
                message: 'No file uploaded'
            });				
			}else {
				imageFile = req.files.image.name
				var imagefil = req.files.image
			}

				//var imageFile = typeof req.files.image != "undefined" ? req.files.image.name:"";
				req.checkBody('image','you must upload an image').isImage(imageFile)				
				req.checkBody('title','title cannot be empty').notEmpty()
				req.checkBody('description','content cannot be empty').notEmpty()
				req.checkBody('price','price cannot be empty').notEmpty()
			

				const title = req.body.title;
				const slug = title.replace(/\s+/g,'-').toLowerCase();
				var description = req.body.description;
				var price = req.body.price;
				var category = req.body.category;
				var pimage = req.body.pimage;
				var id = req.params.id;
				
				var errors = req.validationErrors();
				if(errors) {
					req.session.errors = errors;
					res.redirect('/products/edit/'+product.id)
				}else {
					Product.findOne({slug:slug,id:{'$ne':id}},(err,product)=> {
						if(err) {
							console.log(err)
							throw err
						}
						if(product) {
							req.flash('error','product exist choose another one');
							 res.redirect('/products/edit/' + product.id)

						}else {
							Product.findById(id,(err,product)=> {
								if(err) {
									throw err
								}
								product.title = title;
								product.description = description;
								product.slug = slug;
								product.price = parseFloat(price).toFixed(2);
								product.category = category;

								if(imageFile != "") {
									product.image = imageFile
								}

								product.save((err)=> {
									if(err) {
										throw err
									}
									if(imageFile !="") {
										if(pimage !="") {
											fs.remove('public/Product' + id + '/' + pimage,function(err) {
												if(err) {
													console.log(err)
												}

											})
										}
									}
									let productImage = req.files.image;
									var path = 'public/productImage/' + product.id + '/' + imageFile;

									productImage.mv(path,function(err) {
										return console.log('err')
									})
								})

								req.flash('info','product added');
								res.redirect('/products/products')


							})
						}
					})
				}
})

//gallery route
router.post('/productGallery/:id',(req,res)=> {
	let productImage = req.files.file
	const id = req.params.id;
	const path = 'public/productImage/' + id +'/gallery/' + req.files.file.name
	const thumb = 'public/productImage/' + id + '/gallery/thumbs/' + req.files.file.name

	productImage.mv(path,(err)=> {
		if(err) {
			throw err
		}

		resizeImg(fs.readFileSync(path),{width: 100,height:100}).then(function(buf) {
			// fs.writeFileSync(thumbs,buf)
			console.log('this is the buf',buf)
			fs.writeFileSync(thumb, buf);
		})
	})

		
	res.sendStatus(200)
})

//image delete route
router.get('/delete_image/:image',(req,res)=> {
	const originalFile = 'public/productImage/' + req.query.id +'/gallery/' + req.params.image
	const originalThumb = 'public/productImage/' + req.query.id + '/gallery/thumbs/' + req.params.image

	fs.unlink('public/productImage/' + req.query.id +'/gallery/' + req.params.image,function(err){
		if(err) {
			req.flash('error',err)
			res.render('admin/error',{message:req.flash('error')})
		}else {
			fs.unlink('public/productImage/' + req.query.id + '/gallery/thumbs/' + req.params.image,function(err) {
				if(err) {
					throw err
				}else {
					req.flash('info','image removed successfully'),
					res.redirect('/products/edit/' +req.query.id);					
				}
			})
		}
	})


})

//removign a product
router.get('/remove/:id',(req,res)=> {
	const id = req.params.id;

	fs.rmdir('public/productImage/' + id,{recursive:true},function(err) {
		if(err) {
			throw err
		}else {
			Product.findByIdAndRemove(id,(err)=> {
				if(err) {
					throw err
				}
				res.redirect('/products/products')
			})
		}
	})
})

module.exports = router


	
	

