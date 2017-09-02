function handleInstalled(details)
{	// install/update/browser_update/shared_module_update
	browser.storage.local.set(
	{
		removeURLsQueriesAndFragments: true
	});	
}
browser.runtime.onInstalled.addListener(handleInstalled);