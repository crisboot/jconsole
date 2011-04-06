cmdshell.cmd['clear'] = {
	help : 'Clear the terminal screen',
	run : function(res){
		cmdshell.debuger('[CMD] Clear is running');
		
		$('.cmdout').html(':>');
		$('.cmdin').val('');
		
		return false;
	}
}

