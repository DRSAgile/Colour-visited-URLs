function onError(error)
{
	console.log(`Error: ${error}`);
}

function escapeRegExp(str)
{
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function _HideLiveVideosFromYouTubeSubscriptionsList(elem)
{
	browser.storage.local.get("hideLiveVideosFromYouTubeSubscriptionsList").then(function(result)
	{
		if (!result.hideLiveVideosFromYouTubeSubscriptionsList)
		{
			return;
		} // hiding/collapsing the "live" section of YouTube that is on top of the lists of videos in two modes (tiles and list):
		var list = elem.getElementsByClassName('badge-style-type-live-now');
		for (var item of list)
		{
			var currentNode = item;
			while (currentNode)
			{	//console.log(currentNode.tagName);
				if (currentNode.tagName == 'ytd-item-section-renderer'.toUpperCase()) // and className "style-scope ytd-section-list-renderer"
				{
					if (currentNode.style == 'display: none !important; visibility: collapse !important;')
					{
						continue;
					}
					currentNode.style = 'display: none !important; visibility: collapse !important;';
					break;
				}
				else
				{
					currentNode = currentNode.parentNode;
				}
			}
		}	
		/*var list = document.querySelectorAll('#contents.style-scope.ytd-section-list-renderer > ytd-item-section-renderer.style-scope.ytd-section-list-renderer');
		for (var item of list)
		{
			if (item.style == 'display: none !important; visibility: collapse !important;')
			{
				continue;
			}
			else if (item.getElementsByClassName('badge-style-type-live-now').length > 0)
			{
				item.style = 'display: none !important; visibility: collapse !important;';
			}
		}*/
	}, onError);
}

function findAndUpdateTagAWithinElement(elem)
{
	browser.storage.local.get("removeURLsQueriesAndFragments").then(function(result)
	{
		var list = elem.querySelectorAll('[id=video-title]');
		for (var item of list)
		{  
			var currentNode = item;
			while (currentNode)
			{
				if (currentNode.tagName == 'A')
				{  // removing a class from "a" tag that tampers with showing correct "a:visited" colour, set above in te GM_addStyle:
					currentNode.classList = currentNode.classList.toString().replace(new RegExp(escapeRegExp('style-scope'), "g"), '');
					if (result.removeURLsQueriesAndFragments)
					{
						currentNode.href = currentNode.href.replace(/&list=([_a-zA-Z0-9]*)/g, '');
						currentNode.href = currentNode.href.replace(/&index=([0-9]*)/g, '');
						currentNode.href = currentNode.href.replace(/&t=([0-9]*)s/g, ''); //console.log('DRS: ' + currentNode.href);
					}
					break;
				}
				else
				{
					currentNode = currentNode.parentNode;
				}
			}
		}         
	}, onError);
}        

//console.log('DRS: start');
window.addEventListener("DOMContentLoaded", function()
{	//console.log('DRS: DOMContentLoaded fired'); 
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
	_HideLiveVideosFromYouTubeSubscriptionsList(document); // almost never does any work as all or the most of nodes are not created yet (as it is DHTML, (almost) no HTML is loaded from servers)
	findAndUpdateTagAWithinElement(document); // almost never does any work as all or the most of nodes are not created yet (as it is DHTML, (almost) no HTML is loaded from servers)
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(function(mutations)
	{
		mutations.forEach(function(mutation)
		{	//console.log("DRS: mutation.type: " + mutation.type.toString() + ", length: " + mutation.addedNodes.length.toString()); 
			if (mutation.addedNodes.length > 0)
			{
				for (var i = 0; i < mutation.addedNodes.length; ++i)
				{
					var elem = mutation.addedNodes[i]; 
					if (elem.innerHTML === undefined)
					{
						continue;
					}
					_HideLiveVideosFromYouTubeSubscriptionsList(elem); 			
					findAndUpdateTagAWithinElement(elem);
				}
			}
		});    
	}); // pass in the target node, as well as the observer options
	observer.observe(document, {attributes: false, childList: true, subtree: true, characterData: false});	
});


