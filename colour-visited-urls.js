function onError(error)
{
	console.log(`Error: ${error}`);
}

function escapeRegExp(str)
{
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function handleInstalled(details)
{
	console.log('DRS: ' + details.reason);
	browser.storage.local.set(
	{
		removeURLsQueriesAndFragments: true
	});	
	/*browser.tabs.create(
	{
		url: "http://chilloutandwatchsomecatgifs.com/"
	});*/
}

function findAndUpdateTagAWithinElement(elem)
{
	var removeURLsQueriesAndFragments = true;
	browser.storage.local.get("removeURLsQueriesAndFragments").then(function(item)
	{
		if (item.removeURLsQueriesAndFragments)
		{
			removeURLsQueriesAndFragments = item.removeURLsQueriesAndFragments;
		}		
	}, onError);
	var list = elem.querySelectorAll('[id=video-title]');
	for (var item of list)
	{  
		var currentNode = item;
		while (currentNode)
		{
			if (currentNode.tagName == 'A')
			{  // removing a class from "a" tag that tampers with showing correct "a:visited" colour, set above in te GM_addStyle:
				currentNode.classList = currentNode.classList.toString().replace(new RegExp(escapeRegExp('style-scope'), "g"), '');
				currentNode.href = currentNode.href.replace(/&list=([_a-zA-Z0-9]*)/g, '');
				currentNode.href = currentNode.href.replace(/&index=([0-9]*)/g, '');
				currentNode.href = currentNode.href.replace(/&t=([0-9]*)s/g, ''); //console.log('DRS: ' + currentNode.href);
			break;
			}
			else
			{
				currentNode = currentNode.parentNode;
			}
		}
	}         
}        




console.log('DRS: start');
//console.log('DRS: ' + browser);
//console.log('DRS: ' + browser.runtime);
//console.log('DRS: ' + browser.runtime.onInstalled);
// browser.runtime.onInstalled.addListener(handleInstalled);

window.addEventListener("DOMContentLoaded", function()
{
	//console.log('DRS: DOMContentLoaded fired'); 
	var css = 'a:visited {color: darkmagenta !important;} .js-display-url, .title, .title-and-badge, text-wrapper, #title-wrapper,  .style-scope.ytd-compact-video-renderer, .style-scope.ytd-playlist-panel-video-renderer {color: inherit !important;}',
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet)
	{
	  style.styleSheet.cssText = css;
	} 
	else
	{
	  style.appendChild(document.createTextNode(css));
	}
	head.appendChild(style);
	findAndUpdateTagAWithinElement(document); // almost never does any work as all or the most of nodes are not created yet (as it is DHTML, (almost) no HTML is loaded from servers)
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(function(mutations)
	{
		mutations.forEach(function(mutation)
		{	//console.log("mutation.type: " + mutation.type.toString() + ", length: " + mutation.addedNodes.length.toString()); 
			for (var i = 0; i < mutation.addedNodes.length; ++i)
			{
				var elem = mutation.addedNodes[i]; 
				if (elem.innerHTML === undefined)
				{
					continue;
				}
				findAndUpdateTagAWithinElement(elem);
			}
		});    
	}); // pass in the target node, as well as the observer options
	observer.observe(document, {attributes: false, childList: true, subtree: true, characterData: false});
});


