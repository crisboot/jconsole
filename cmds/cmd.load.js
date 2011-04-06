cmdshell.cmd.load = {
	help : 'Load Scripts from URL',
	run : function(res){
		cmdshell.debuger('[CMD] Load is running');
		
		var arr = res.split(" "), url_match = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/;
		
		if(!arr[1]){
			return 'Try load help for more options...';
		}else{
			if(arr[1]=="help"){
				return "usage: load <URL> \n i.e. load http://www.cornify.com/js/cornify.js \n and the try: eval cornify_add() ";
			}else{
				if(url_match.test(arr[1])){				
					cmdshell.addScript(arr[1]);
					return "script successfully loaded";
				}else{
					return "warning: something was wrong with your <URL>";
				}
			}
			
		}
	}
}

