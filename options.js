function saveOptions(e)
{
	e.preventDefault();
	browser.storage.local.set(
	{
		removeURLsQueriesAndFragments: document.querySelector("#removeURLsQueriesAndFragments").checked
	});
}

function restoreOptions()
{
	function setCurrentChoice(result)
	{
		document.querySelector("#removeURLsQueriesAndFragments").checked = result.removeURLsQueriesAndFragments || true;
	}

	function onError(error)
	{
		console.log(`Error: ${error}`);
	}

	var getting = browser.storage.local.get("removeURLsQueriesAndFragments");
	getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);