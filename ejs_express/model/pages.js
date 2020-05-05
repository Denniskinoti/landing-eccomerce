const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
	title :{type:String,required:true},
	content:{type:String,required:true},
	slug :{type:String},
	sort:{type:Number,default:0}

})



module.exports = mongoose.model('page',pageSchema)
