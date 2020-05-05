var express = require('express');
var router = express.Router();
const Page = require('../model/pages')
const { check, validationResult } = require('express-validator');

//get pages index
router.get('/', function(req, res, next) {
	res.send('hoo')
	
});

//add pages
router.get('/addPage',(req,res)=> {
	const title = ""
	const content = ""
	const slug = ""

	res.render('admin/add_page',{title:title, content:content,slug:slug})
});



router.post('/addPage',(req,res)=> {

				let title = req.body.title;
				let slug = title.replace(/\s+/g,'-').toLowerCase();	
				let content = req.body.content;
				
				req.checkBody('title','title cannot be empty').notEmpty()
				
				req.checkBody('content','content cannot be empty').notEmpty()

				
				


				Page.findOne({slug:slug},(err,page)=> {
					if(page) {
						req.flash('error','page exists');
						res.render('admin/add_page',{messages:req.flash('error'),title:req.body.title,content:req.body.content,slug:req.body.slug})
					}else {
							const page = new Page({
					title:slug,
					content: content,
					slug: slug,
					sort: 100
				});

				page.save().then((page)=> {
					if(page) {
						req.flash('info','successfully created')
						// res.render('admin/pages',{page:page,message:req.flash('info')})
						res.redirect('/admin/pages');
							}
					}).catch((error)=> {
						throw error
							})

					}
				})						
			
		})

//index route
router.get('/pages',(req,res)=> {
	Page.find({}).sort({sorting:1}).exec((err,page)=> {
	if(err) {
		throw err
		console.log('err')
	}else {
		req.flash('info','successfully got all items')
		res.render('admin/pages',{page:page,message:req.flash('info')})
	}
})

})

router.post('/reOrder',(req,res) => {
	console.log(req.body)
});

router.get('/edit/:slug',(req,res)=> {
	Page.findOne({slug:req.params.slug},(err,page)=> {
		if(err) {
			throw err
			
		}else {
			req.flash('info','this is the edit page')
			res.render('admin/edit_page',{
				title:page.title,
				content:page.content,
				slug:page.slug,
				id:page.id,
				message:req.flash('info')
			})
		}

	})
})

router.post('/edit/:slug',(req,res)=> {

				let title = req.body.title;
				let slug = title.replace(/\s+/g,'-').toLowerCase();
				let content = req.body.content;

				req.checkBody('title','title cannot be empty').notEmpty()				
				req.checkBody('content','content cannot be empty').notEmpty()
				var errors = req.validationErrors();
				if(errors) {
					var messages = [];
					errors.forEach(function(error) {
							messages.push(error.msg)
						})	
						req.flash('error',messages)
						console.log(messages)
					res.render('admin/edit_page',{message:req.flash('error'),title:req.body.title,content:req.body.content,slug:req.body.slug ,id:req.body.id})			
				}

				Page.findOne({slug:slug, _id:{'$ne':req.body.id}},(err,page)=> {
					if(page) {
						req.flash('error','slug page exists');

						res.render('admin/edit_page',{message:req.flash('error'),title:req.body.title,content:req.body.content,slug:req.body.slug,id:req.body.id})
					}else {

						Page.findById(req.body.id).then((page)=> {
							if(page) {
								res.send(req.body.id)
							}

						}).catch((error)=> {
							console.log(error)
						})

						const paage = new Page({
							title:title,
							content: content,
							slug: slug	
						});

						paage.save().then((page)=> {
							if(page) {
								 res.redirect('/admin/edit/' + page.slug);
								
							}
						}).catch((Error)=> {
							throw Error;
							console.log(Error)
						})




					}



})
})

//page delete route

router.get('/remove/:id',(req,res)=> {
	Page.findByIdAndRemove(req.params.id,(err)=> {
		if(err) {
			res.send(err)
		}
		req.flash('info','page deleted successfully');
		 res.redirect('/admin/pages')
		
	})
})

// router.post('/edit/:slug',(req,res)=> {	
				
// 				req.checkBody('title','title cannot be empty').notEmpty()
// 				req.checkBody('slug','slug cannot be empty').notEmpty()	
// 				req.checkBody('content','content cannot be empty').notEmpty()
// 				var errors = req.validationErrors();
// 				if(errors) {
// 					var messages = [];
// 					errors.forEach(function(error) {
// 							messages.push(error.msg)
// 						})	
// 						req.flash('error',messages)
// 						console.log(messages)
// 					res.render('admin/edit_page',{message:req.flash('error'),title:req.body.title,content:req.body.content,slug:req.body.slug ,id:req.body.id})			
// 				}


// 				Page.findOne({slug:req.body.slug, _id:{'$ne':req.body.id}},(err,page)=> {
// 					if(page) {
// 						req.flash('error','slug page exists');
// 						res.render('admin/edit_page',{message:req.flash('error'),title:req.body.title,content:req.body.content,slug:req.body.slug,id:req.body.id})
// 					}else {

// 					Page.findById(req.body.id,function(err,page) {
// 						if(err) {
// 							throw err
// 						}
// 						const paage = new Page({
// 							title:req.body.title,
// 							content: req.body.content,
// 							slug: req.body.slug,
							
							
							
							
// 						});

// 						paage.save().then((page)=> {
// 							if(page) {
// 								req.flash('info','successfully created')
// 								// res.render('admin/pages',{page:page,message:req.flash('info')})
// 								// res.redirect('/admin/edit' + page.slug);
// 								res.send(page)
// 									}
// 							}).catch((error)=> {
// 								throw error
// 									})

// 						})

				

			

// 					}
// 				})						
			
// 		})

module.exports = router;