cmdshell.cmd['psmgr'] = {
	help : 'A process manager',
	run : function(res){
		cmdshell.debuger('[CMD] PsMgr is running');
		var arr = res.split(" "), msg = '', nActive = 0;
		
		if(!arr[1]){
			if(cmdshell.psMgr.psRunning.length > 0){
				
				msg += 'PID		NAME			COUNT\n';
				msg += '------------------------------------------------------- \n';
				
				$.each(cmdshell.psMgr.psRunning, function(i){
					if(cmdshell.psMgr.ps[i].active){
						msg += cmdshell.psMgr.ps[i].pid +'		'+cmdshell.psMgr.ps[i].psName +'		'+cmdshell.psMgr.ps[i].nExecutions+'\n';
					nActive++;
					}
				});
				
				msg += '------------------------------------------------------- \n';
				msg += '('+nActive+') Process Running';
				
				if(nActive>0){
					return msg;
				}else{
					return 'No process running... \n Try psmgr help for more options...';
				}

			}else{
				return 'No process running... \n Try psmgr help for more options...';
			}
		}else{
			if(arr[1]=="help"){
				msg += 'usage: \n Starting a process: \n\n';
				msg += '   eval cmdshell.psMgr.start({psName: "Process Sample", milisec:2000, execute: function(){ cmdshell.debuger( new Date().getTime() )}, nStop: 10});\n\n';
				msg += '   eval cmdshell.psMgr.start({psName: "jConsole Sample", milisec:2000, execute: function(){ jQuery("body").prepend(" jconsole rocks") }, nStop: 10})\n\n';
				msg += ' Stopping a process:\n\n';
				msg += '   psmgr stop <PID>\n\n';
				msg += ' Stopping all processes:\n\n';
				msg += '   psmgr stopall\n\n';
				return msg;

			}else if(arr[1]=='stop'&&!isNaN(arr[2])&&typeof(cmdshell.psMgr.ps[arr[2]])!='undefined'){
				if(cmdshell.psMgr.ps[arr[2]].active){
					cmdshell.psMgr.stop(arr[2]);
					return "PS PID("+arr[2]+") is killed";
				}else{
					return "Sorry that process is not active";
				}
			}else if(arr[1]=='stopall'){
				cmdshell.psMgr.stopAll();
				return "Killing all processes...";
			}else{
				return 'Try psmgr help for more options...';
			}
			
		}
		
	}
}

