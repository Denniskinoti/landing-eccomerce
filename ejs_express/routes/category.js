const express=  require('express');
const router = express.Router();

const Category = require('../model/category');


router.get('/category',(req,res)=> {
	Category.find().then((category)=> {
		if(Category) {
			req.flash('info','this is the category page')
			res.render('admin/category',{category:category,message:req.flash('info')});
		}
	}).catch((error)=> {
		throw error;
		console.log(error)
	})
})

router.get('/addCategory',(req,res)=> {

	const title = "";
	req.flash('info','new category page')
	res.render('admin/add_category',{title:title,message:req.flash('info')})
});


//creating a new category
router.post('/new',(req,res)=> {
	req.checkBody('title','title cannot be empty').notEmpty()

	var title = req.body.title;
	var slug = title.replace('/\s+/g','-').toLowerCase();

	var errors = req.validationErrors();
				if(errors) {
					var messages = [];
					errors.forEach(function(error) {
							messages.push(error.msg)
						})	
						req.flash('error',messages)
						console.log(messages)
					res.render('admin/category',{messages:req.flash('error'),title:req.body.title})			
				}

	Category.findOne({slug:slug},(err,category)=> {
					if(category) {
						req.flash('error','category exists');
						res.render('admin/add_category',{messages:req.flash('error'),title:req.body.title})
					}else {

						const category = new Category({
								title:req.body.title,					
								slug: slug
					
						});

							console.log('this is the category',category)

				category.save().then((category)=> {
					if(category) {

							Category.find().then((category)=> {
							  if(category) {
							    req.app.locals.category = category
							  }
							}).catch((error)=> {
							  throw error
							})

						req.flash('info','category successfully created')
						// res.render('admin/pages',{page:page,message:req.flash('info')})
						res.redirect('/category/category');
							}
					}).catch((error)=> {
						throw error
							})

					}
				})

});

// //posting edited category
router.post('/edit/:id',(req,res)=> {
	req.checkBody('title','title cannot be empty').notEmpty()
	var title = req.body.title;
	var id = req.params.id
	var slug =title.replace('/\s+/g','-').toLowerCase();
	var errors = req.validationErrors();
				if(errors) {
					var messages = [];
					errors.forEach(function(error) {
							messages.push(error.msg)
						})	
						req.flash('error',messages)
						console.log(messages)
					res.render('admin/category',{messages:req.flash('error'),title:req.body.title})			
				}

	Category.findOne({slug:slug,id:{'$ne':id}},(err,category)=> {
		if(category) {
			req.flash('error','category exists')
			res.render('admin/edit_category',{message:req.flash('error'),title:title,id:id})
		}else {
	Category.findById(req.params.id,(err,category)=>{
		if(err) {
			return console.log(err)
		}else {
			category.title = title;
			category.slug = slug;

			category.save().then((category)=> {
				if(category) {


					Category.find().then((category)=> {
					  if(category) {
					    req.app.locals.category = category
					  }
					}).catch((error)=> {
					  throw error
					})

					req.flash('info','category successfully edited');
					res.redirect('/category/edit/' + id)
				}
			}).catch((error)=> {
				console.log(error)
			})

		}
	})
		}
	})

	
})

router.get('/edit/:id',(req,res)=> {
	Category.findById(req.params.id,(err,category)=> {
		if(err) {
			console.log(err)
			
		}
		req.flash('info','category page')
		res.render('admin/edit_category',{title:category.title, id:category.id,message:req.flash('info')})
	})
});

router.get('/remove/:id',(req,res)=> {
	Category.findByIdAndRemove(req.params.id,function(err) {
		if(err) {
			throw err
		}


			Category.find().then((category)=> {
			  if(category) {
			   req.app.locals.category = category
			  }
			}).catch((error)=> {
			  throw error
			})

		req.flash('info','category removed successfully')
		res.redirect('/category/Category')
	})
})

module.exports = router;