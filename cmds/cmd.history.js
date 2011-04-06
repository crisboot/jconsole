cmdshell.cmd['history'] = {
	help : 'Displays history of commands',
	run : function(res){
		cmdshell.debuger('[CMD] Help is running');
		var msg	= "jConsole history \n------------------------------------------------------- \n";	
		$.each(cmdshell.hisCmd, function(i, cmds){
			msg += i+' '+cmds+'\n';
		});
		
		return msg;
	}
}

