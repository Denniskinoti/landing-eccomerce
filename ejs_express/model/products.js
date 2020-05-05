const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	title :{type:String,required:true},
	description:{type:String,required:true},
	slug :{type:String},
	image:{type:String},
	category :{type:String,required:true,trim:true},
	price:{type:Number,required:true}

})

module.exports = mongoose.model('products',productSchema)