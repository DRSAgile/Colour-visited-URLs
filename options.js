function saveOptions(e)
{
	e.preventDefault();
	browser.storage.local.set(
	{
		removeURLsQueriesAndFragments: document.querySelector("#removeURLsQueriesAndFragments").checked,
		hideLiveVideosFromYouTubeSubscriptionsList: document.querySelector("#hideLiveVideosFromYouTubeSubscriptionsList").checked
	});
}
function restoreOptions()
{
	function onError(error)
	{
		console.log(`Error: ${error}`);
	}
	browser.storage.local.get("removeURLsQueriesAndFragments").then(function(result)
	{
		document.querySelector("#removeURLsQueriesAndFragments").checked = result.removeURLsQueriesAndFragments;
	}, onError);
	browser.storage.local.get("hideLiveVideosFromYouTubeSubscriptionsList").then(function(result)
	{
		document.querySelector("#hideLiveVideosFromYouTubeSubscriptionsList").checked = result.hideLiveVideosFromYouTubeSubscriptionsList;
	}, onError);
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);