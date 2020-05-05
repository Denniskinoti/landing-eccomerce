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

	Category.find({slug:req.body.slug},(err,category)=> {
					if(category) {
						req.flash('error','category exists');
						res.render('admin/add_category',{messages:req.flash('error'),title:req.body.title})
					}else {
					const category = new Category({
						title:title,					
						slug:slug
					
				});

				category.save().then((page)=> {
					if(category) {
						req.flash('info','successfully created')
						// res.render('admin/pages',{page:page,message:req.flash('info')})
						res.redirect('/category/category');
							}
					}).catch((error)=> {
						throw error
							})

					}
				})

});

//new category

router.post('/edit/:id',(req,res)=> {
	req.checkBody('title','title cannot be empty').notEmpty()

	var title = req.body.title;
	var slug = title.replace('/\s+/g','-').toLowerCase();
	var id = req.params.id;

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

	Category.findOne({slug:req.body.slug},(err,category)=> {
					if(category) {
						req.flash('error','category title exists');
						res.render('admin/add_category',{messages:req.flash('error'),title:req.body.title})
					}else {
						
					Category.findById(id,(err,category)=>{
						if(err) {
							throw err
						}
						category.title = title;
						category.slug = slug

						category.save().then((page)=> {
					if(category) {
						req.flash('info','successfully created')
						// res.render('admin/pages',{page:page,message:req.flash('info')})
						res.redirect('/category/category');
							}
					}).catch((error)=> {
						throw error
							})
					})

				

					}
				})

})

module.exports = router;



function isImage (value,filename) {
			var extension = (path.extname(filename)).toLowerCase();
			switch(extension) {
				case '.jpg':return '.jpg';
				case '.jpeg':return '.jpeg';
				case '.png':return '.png';
				case '':return '.jpg';
				default: return false;
			}
		}



		<li class="nav-item">
            <a class="nav-link" href="/admin/addPage">Add page</a>
          </li>