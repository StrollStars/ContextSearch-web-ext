if ( window != top && window.location.hash === '#addtocontextsearch' ) {

	browser.runtime.sendMessage({action: "getOpenSearchLinks", frame: true}).then( async oses => {

		for ( ose of oses ) {

			// skip default mycroftproject engine
			if ( ose.href.endsWith('/opensearch.xml')) continue;

			let xml_se = await browser.runtime.sendMessage({action: "openSearchUrlToSearchEngine", url: ose.href}).then( details => {
				return (!details) ? null : details.searchEngines[0];
			});

			return browser.runtime.sendMessage({action: "openCustomSearch", se: xml_se});
		}
	});
}
function showButtons() {

	let links = document.querySelectorAll('a[href*="/install.html"]');

	links.forEach( link => {
		let img = new Image();
		img.src = browser.runtime.getURL('icons/logo_notext.svg');
		img.className = 'icon';
		img.style.marginRight = '4px';
		img.style.cursor = 'pointer';
		img.title = browser.i18n.getMessage("AddCustomSearch");

		img.onclick = function(e) {
			let iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
			iframe.src = link + "#addtocontextsearch";
		}

		link.parentNode.insertBefore(img, link);
	});
}

if ( document.readyState === 'complete' ) showButtons();

window.addEventListener('load', showButtons);
