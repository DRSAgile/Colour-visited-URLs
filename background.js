function handleInstalled(details)
{	// details.reason == install/update/browser_update/shared_module_update
	browser.storage.local.set(
	{
		removeURLsQueriesAndFragments: true,
		hideLiveVideosFromYouTubeSubscriptionsList: true
	});	
}
browser.runtime.onInstalled.addListener(handleInstalled);