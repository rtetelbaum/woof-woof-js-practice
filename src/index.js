// DOM ELEMENTS

const filterBtn = document.querySelector("#good-dog-filter")
const dogBarDiv = document.querySelector("#dog-bar")
const dogSummaryDiv = document.querySelector("#dog-summary-container")
const dogInfoDiv = document.querySelector("#dog-info")

// LISTENERS

dogBarDiv.addEventListener("click", fetchGetPup)
filterBtn.addEventListener("click", toggleFilter)

// HANDLERS

function toggleFilter(event) {
	const barArray = dogBarDiv.querySelectorAll("span")
	if (event.target.textContent === "Filter good dogs: OFF") {
		event.target.textContent = "Filter good dogs: ON"
		barArray.forEach((span) => {
				if (span.dataset.status === "false") {
					span.style.display = "none"
				}
			})
	} else if (event.target.textContent === "Filter good dogs: ON") {
		event.target.textContent = "Filter good dogs: OFF"
		barArray.forEach((span) => {
			if (span.dataset.status === "false") {
				span.style.display = ""
			}
		})
	}
}

function fetchGetBar() {
	fetch('http://localhost:3000/pups')
		.then(response => response.json())
		.then(pupsData => renderBar(pupsData))
}

function fetchGetPup(event) {
	fetch(`http://localhost:3000/pups/${event.target.dataset.id}`)
		.then(response => response.json())
		.then(pupData => renderInfo(pupData))
}

function fetchPatchPup(event) {
	let data = {}
	if (event.target.dataset.status === "Good Dog!") {
		data = {"isGoodDog": false}
	} else if (event.target.dataset.status === "Bad Dog!") {
		data = {"isGoodDog": true}
	}
	fetch(`http://localhost:3000/pups/${event.target.dataset.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(newData => renderInfo(newData))
}

// RENDERERS

function renderBar(pupsData) {
	pupsData.forEach(pup => {
		const pupSpan = document.createElement("span")
		pupSpan.dataset.id = pup.id
		pupSpan.dataset.status = pup.isGoodDog
		pupSpan.textContent = pup.name
		dogBarDiv.append(pupSpan)
	})
}

function renderInfo(pupData) {
	let dogStatus = ""
	pupData.isGoodDog ? dogStatus = "Good Dog!" : dogStatus = "Bad Dog!"
	dogInfoDiv.innerHTML = `
		<img src=${pupData.image} alt=${pupData.name}>
		<h2>${pupData.name}</h2>
		<button id="dogStatusBtn" data-id=${pupData.id} data-status="${dogStatus}">${dogStatus}</button>
	`
	const dogStatusBtn = document.querySelector("#dogStatusBtn")
	dogStatusBtn.addEventListener("click", fetchPatchPup)
}

// INITIALIZER

function initialize() {
	fetchGetBar()
}

initialize()