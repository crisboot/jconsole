/**
* jConsole - Console Manager for jQuery  
* Released under GPL v3 License
* @author Cristian Ariel Cortez  
* @copyright (c) 2010 - 2012 Cristian Ariel Cortez - cortez[dot]cristian[at]gmail[dot]com - http://skyconcept.com.ar/crisboot/
* @date 20/05/2010
* @requires jQuery v1.4 or above
*
*/

/**
*  HTML markup example:
* <div class="jconsole">
* </div>
*
*/

;(function($){

	if (window.cmdshell) _cmdshell = cmdshell;
	
	cmdshell = {
		nCmd:0,
		hisCmd:[],
		cmd: {}, //namespace for the commands
		cmdsPath: './cmds/cmd.',
		localCmds : [ 'clear','eval','help','history','load','psmgr'],
		//localCmds : [ 'call', 'clear', 'eval', 'jconsole', 'help', 'taskRunner', 'showMsg', 'writeBack'],
		founded : [],
		toLoad: {
			'jquery' : {url: './js/jquery.min.js'}
		},
		addScript: function(url_name){		
			var headElem = document.getElementsByTagName('head')[0];         
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = url_name;
			headElem.appendChild(newScript);
		},
		allowPHP: true,
		urlPHP: './php/jconsole.php',
		debug: true,
		debuger: function(){
			if(cmdshell.debug)
				try{console.log.apply('',arguments);} catch(e) {}
		},
		runCmd: function(cmd){
			try{
				
				var found = 0, re, command, cmdex, result = false;
				
				//Itarate local commands first
				$.each(cmdshell.founded, function(i, cmdName){
					re = new RegExp('^'+cmdName.toLowerCase());
					command = cmd.split(" ");
					if (command[0].match(re)){
						cmdshell.debuger('[CMD] founded known command: '+cmdName.toLowerCase());
						found = 1;
						//execute
						cmdex = "cmdshell.cmd['"+cmdName+"'].run('"+cmd+"');";
						cmdshell.debuger('[CMD] Executing: '+cmdex);
						result = eval(cmdex);
					}
				})
				
				if(found == 0 && cmdshell.allowPHP){
					cmdshell.debuger('[CMD] Executing Console OS command: ' + cmd);
					$.ajax({
						type: "GET",
						url: cmdshell.urlPHP,
						data: {cmd:cmd},
						processData: true,
						async:false,
						contentType: "application/text; charset=utf-8",
						dataType: "text",
						success: function(responseText) {
						  
							if(responseText){
								result = responseText;
							}else{
								result = 'Command not found';
							}
						}
					});
				}
				
				
			
			}catch(e){
				cmdshell.debuger('[ERROR] Cmd run: '+e);
			}
			
			return result;
			
		},
		start: function(){
			cmdshell.debuger('Starting jConsole...');
			
			//setup cache	
			$.ajaxSetup ({  
				cache: false  
			}); 
			
			cmdshell.debuger('Trying to load jConsole local modules...');
			$.each(cmdshell.localCmds, function(i, cmdName){
					cmdshell.addScript(cmdshell.cmdsPath+cmdName+'.js');
					
					cmdshell.debuger('Add Script: '+cmdshell.cmdsPath+cmdName+'.js');
					
					(function(){
						if(!cmdshell.cmd[cmdName]){
							setTimeout(arguments.callee, 30);
							return;
						}
						cmdshell.founded.push(cmdName);
					})();
									
			});
			
		},
		version: '1.0',
		psMgr: {
			ps : [],
			psRunning: new Array(),
			pid: -1,
			start: function(obj){
				cmdshell.psMgr.pid++;
			
				var o = $.extend({
					milisec: 1000,
					execute: function(){
						cmdshell.debuger('Process run');
					},
					fails: function(error, pid){
						cmdshell.debuger('Process pid('+o.pid+') fails: '+ error);
						cmdshell.psMgr.stop(o.pid); 
					},
					psName: 'User process',
					pid: cmdshell.psMgr.pid,
					active: true,
					nStop: 0, //0 - loop infinite, n - give a certain number of executions
					started: new Date().getTime(),
					nExecutions: 0 //number off executions
				}, obj || {});
				
				cmdshell.psMgr.ps.push(o);	
				cmdshell.debuger('Creating process pid: '+o.pid);			
				cmdshell.debuger('Cant: '+cmdshell.psMgr.psRunning.length);			
				cmdshell.psMgr.psRunning[o.pid] = setInterval(function(){
					try{ console.log(o)
						o.execute(); 
						o.nExecutions++; console.log(o.nStop+'<='+o.nExecutions);						
						if(o.nStop != 0 && o.nStop <= o.nExecutions){
							o.active = false; 
							cmdshell.psMgr.stop(o.pid);
						}
					}catch(e){ o.active = false; o.fails(e, o.pid); }
				}
				, o.milisec);
				
				
				
				return false;
			},
			stop: function(pid){
				cmdshell.debuger('Trying to stop process pid: '+pid);
				cmdshell.debuger(cmdshell.psMgr.psRunning[pid]);
				cmdshell.debuger('that was'+cmdshell.psMgr.psRunning[pid]);
				clearInterval(cmdshell.psMgr.psRunning[pid]);
				cmdshell.psMgr.ps[pid].active = false;
				//delete cmdshell.psMgr.psRunning[pid];
				//cmdshell.psMgr.psRunning.splice(pid,1);//remove from list

				return false;
			},
			stopAll: function(){
				$.each(cmdshell.psMgr.psRunning, function(i){
					clearInterval(cmdshell.psMgr.psRunning[i]);
					cmdshell.psMgr.ps[i].active = false;
					//delete cmdshell.psMgr.psRunning[i];
					//cmdshell.psMgr.psRunning.splice(i,1);//remove from list
				});
				
				return false;
			}
			
		}
	}
		

	

	$.fn.jconsole = function(obj){
		
		cmdshell.start();
		// Sample process
		cmdshell.psMgr.start({psName: 'Process 1', milisec:2000, execute: function(){ cmdshell.debuger( 'p1'+new Date().getTime() )}, nStop: 5});
		cmdshell.psMgr.start({psName: 'Process 2', milisec:3000, execute: function(){ cmdshell.debuger( 'p2 '+new Date().getTime() )}, nStop: 4});
		
		/**
		* Configuration Object
		*/
		var o = $.extend({			
			afterEnd: function(instObject){ 
				
				if(o.accessibilityEnabled)
					o.handleAccessibility(instObject);
			},
			beforeStart:function(instObject){
				
			},
			onClose: function(id, content){

			},
			onResize: function(instObject){
				debuger("resize");
			},
			handleAccessibility: function(instObject){
			
			},
			cmdIn: 'cmdin',
			cmdOut: 'cmdout',
			sep: '<br />',
			symbol : ':>',
			accessibilityEnabled: false,
			debug: true,
			debugColors: false,
			minConsoleHeight: 250,
			maxConsoleHeight: 700
		}, obj || {});
		
		/**
		* Function Debuger to show logs in Firebug
		*/
		function debuger(){
			if(o.debug)
				try{console.log.apply('',arguments);} catch(e) {}
		}
		
		
		return this.each(function() {
			//console.log($(this));
			debuger(location.hash);
		
			var curIns = $(this); //current Instance
		
			curIns.append('<div class="'+o.cmdOut+'"></div><input class="'+o.cmdIn+'" type="text" value="" />');
			o.cmdIn = '.'+o.cmdIn;
			o.cmdOut = '.'+o.cmdOut;
			curIns.find(o.cmdOut).css('min-height',o.minConsoleHeight).css('max-height',o.maxConsoleHeight).append(o.symbol);
			curIns.find(o.cmdIn).keydown(function(e) {
				var key = e.charCode || e.keyCode || 0, valueCmd, resultCmd = false;
				
				switch(key){
					case 13://enter
						debuger("enter");
						valueCmd = $(this).val();
						if(valueCmd){
							cmdshell.hisCmd[cmdshell.hisCmd.length] = valueCmd;
							cmdshell.nCmd = cmdshell.hisCmd.length;
							resultCmd = cmdshell.runCmd(valueCmd);
						}
					break;
					case 38://up
						debuger("up");
						if(cmdshell.nCmd>0){
							cmdshell.nCmd--;
							$(this).val(cmdshell.hisCmd[cmdshell.nCmd]);
						}
					break;
					case 40://down
						debuger("down");
						if(cmdshell.nCmd < cmdshell.hisCmd.length-1){
							cmdshell.nCmd++;
							$(this).val(cmdshell.hisCmd[cmdshell.nCmd]);
						}
					break;
					default:
					break;
				}
				
				if(resultCmd){//Show the result of the command
					var cmdOut = $(o.cmdOut).append(' '+valueCmd+o.sep+o.sep), lines = resultCmd.split("\n\n");
					
					for(var nLine in  lines){
						cmdOut.append('<pre style="inline">'+ lines[nLine].replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</pre>'+o.sep);
					}
					
					cmdOut.append(o.symbol).attr('scrollTop', $(o.cmdOut).attr('scrollHeight'));
					
					$(o.cmdIn).val('');
				}
								
			}).focus();
			
		
			$(window).resize(function() {
				//debuger(curIns)
				o.onResize(curIns);
					
			});
			
			o.afterEnd(curIns);
		});//close return
	}
})(jQuery);
