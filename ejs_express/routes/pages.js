const express = require('express');
const Page = require('../model/pages')
const router = express.Router();


router.get('/',(req,res)=> {
	Page.findOne({slug:'home'},(err,page)=> {
		if(err) {
			throw err
		}
		req.flash('info','this is the index page')
		res.render('admin/index',{page:page, message:req.flash('info')})
	})

})

router.get('/:slug',(req,res)=> {
	const slug = req.params.slug;

	Page.findOne({slug:slug},(err,page)=> {
		if(err) {
			throw err
		}else if(!page) {
			res.send('page does not exist')
		}else if(page) {
			req.flash('info','this is the index page')
			res.render('admin/index',{page:page, message:req.flash('info')})
		}
	})
})




module.exports = router;