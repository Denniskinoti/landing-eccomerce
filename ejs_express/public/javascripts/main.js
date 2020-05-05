$(function(){
	if($('textarea#dd').length) {
		CKEDITOR.replace('dd');
	}

	$('a.confirmDelete').on('click',function(){
		if(!confirm('Are you sure you want to delete this?')){
			return false;
		}
	})
})
