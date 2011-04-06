cmdshell.cmd['eval'] = {
	help : 'Evaluate a JS expression i.e. eval alert(cmdshell.founded)',
	run : function(res){
		cmdshell.debuger('[CMD] Eval is running');	
		
		var arr = res.split(" "),exec='';
		for(var i=1;i < arr.length;i++){//quit first word from string
			console.log(arr[i]);
			exec += arr[i]+" ";
		}

		try{
			eval(exec);
			return "Executed: "+exec;
		}catch(e){
			return "An error occured during the execution: \n\n"+ e;
		}
		
		
	}
}

