cmdshell.cmd['help'] = {
	help : 'Displays help for begginers',
	run : function(res){
		cmdshell.debuger('[CMD] Help is running');
		var msg	= "Welcome to jConsole! This is the list of known commands \n------------------------------------------------------- \n";	
		$.each(cmdshell.founded, function(i, cmds){
			msg += cmds+' - '+cmdshell.cmd[cmds].help+'\n';
		});		
		msg += "------------------------------------------------------- \n";
		msg += "jConsole & cmdshell v."+cmdshell.version;
		return msg;
	}
}

