// In this file, we create the websocket that tracks user activity to assess the effectiveness of the slides, especially excercises.
// We create a UUID and store that as a cookie so that reloading the page will not distort statistics.
// We're not being excessively smart about this, but it's good enough unless somebody actively tries to distort the statistics.
// We create a new UUID for every slide deck so that users cannot be tracked across slide decks.

let deck = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)
var uuid = undefined
var iws = undefined

{
	function getCookie(name) {
		let value = '; ' + document.cookie
		let parts = value.split('; ' + name + '=')
		if (parts.length == 2) return parts.pop().split(';').shift()
	}

	function setCookie(name, value) {
		document.cookie = name + '=' + value
	}

	uuid = getCookie('uuid-' + deck)
	if (!uuid) {
		setCookie('uuid-' + deck, crypto.randomUUID())
		uuid = getCookie('uuid-' + deck)
		// load again so that we know if we're loading from file://
	}

	if (uuid) {
		iws = new ReconnectingWebSocket('wss://ws2023-python-interactive.pi.tillerino.org/interactive')
	} else {
		console.log('loaded locally')
	}
}

async function sendSlideChange(slide) {
	if (iws) {
		iws.send(JSON.stringify({ '@type': 'Slide', uuid, deck, slide }))
	}
}

async function sendExerciseComplete(slide) {
	if (iws) {
		iws.send(JSON.stringify({ '@type': 'Done', uuid, deck, slide, done: true }))
	}
}