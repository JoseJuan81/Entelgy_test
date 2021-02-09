const COUNTRIES_API_URL = 'https://restcountries.eu/rest/v2/lang/es';
const NUMBERS_COUNTRIES_TO_SHOW = 12;

// crear contenedor
const app = {};

// elemento raiz del DOM
app.root = null;

// variable que guardara los paises.
app.countries = [];

// variable que guarda el detalle de un pais
app.countryDetails = {};

// datos del pais seleccionado
app.getCountrysData = function(ev) {
	const countryName = ev.target.innerText;

	app.countryDetails = app.countries.find(c => c.name === countryName);
	app.openModal();
}

// componente pais
app.createCountryElement = function(country) {
	const div = document.createElement('div');
	div.addEventListener('click', app.getCountrysData);
	div.classList.add('country-container');
	div.innerText = country.name;

	return div;
}

// arreglo de paises ordenado aleatoreamente
app.getRandomCountries = function(countries) {
	const range = 3;
	const len = countries.length;

	// acumuladores
	const acc1 = [];
	const acc2 = [];
	const acc3 = [];

	for (let i = 0; i < len; i += 1) {
		const random = Math.floor(Math.random() * range);
		const currentCountry = countries[i];

		if (random >= 2) {
			acc1.push(currentCountry);
		} else if (random >= 1) {
			acc2.push(currentCountry);
		} else {
			acc3.push(currentCountry);
		}
	}

	return [...acc1, ...acc2, ...acc3];
}

// function para consumir API
app.getCountries = function() {
	fetch(COUNTRIES_API_URL, {
		method: 'get'
	}).then((res) => {
		return res.json();
	}).then((response) => {
		app.countries = app.getRandomCountries(response);

		for (let i = 1; i <= NUMBERS_COUNTRIES_TO_SHOW; i += 1) {
			const currentCountry = app.countries[i];
			const countryElement = app.createCountryElement(currentCountry);
	
			app.root.appendChild(countryElement);
		}
	})
	.catch((error) => {
		console.log(error);
	})
};

// Modal
app.createModal = function() {
	// modal background
	const mainContainer = document.createElement('div');
	mainContainer.className = 'modal-main-container';
	mainContainer.addEventListener('click', function(ev) {
		if (ev.eventPhase === 2) {
			app.closeModal();
		}
	});

	// contenedor del contenido del modal
	const modalContentWrapper = document.createElement('div');
	modalContentWrapper.className = 'modal-content';

	// boton para cerrar modal
	const closeModal = document.createElement('button');
	closeModal.innerHTML = '\u2715';
	closeModal.type = 'button';
	closeModal.className = 'close-modal-button';
	closeModal.addEventListener('click', app.closeModal)

	// pais
	const modalCountry = document.createElement('h3');
	modalCountry.className = 'country-title';
	modalCountry.setAttribute('id', 'country');

	// titulo del modal
	const modalTitle = document.createElement('h3');
	modalTitle.className = 'continent-title';
	modalTitle.textContent = 'Continente';

	// contenido modal
	const modalContinent = document.createElement('h2');
	modalContinent.className = 'continent-name';
	modalContinent.setAttribute('id', 'continent');

	modalContentWrapper.appendChild(closeModal);
	modalContentWrapper.appendChild(modalCountry);
	modalContentWrapper.appendChild(modalTitle);
	modalContentWrapper.appendChild(modalContinent);

	mainContainer.appendChild(modalContentWrapper);

	document.body.appendChild(mainContainer);
}

app.closeModal = function() {
	const [modal] = document.getElementsByClassName('modal-main-container');
	modal.classList.remove('show-modal');
}

app.openModal = function() {
	// insertar nombre del pais
	const modalCountry = document.getElementById('country');
	modalCountry.innerText = `Pais: ${app.countryDetails.name}`;

	// insertar nombre del continente
	const modalContinent = document.getElementById('continent');
	modalContinent.innerText = app.countryDetails.region;

	// agregar estilo para mostrar modal
	const [modal] = document.getElementsByClassName('modal-main-container');
	modal.classList.add('show-modal');
}

window.addEventListener('DOMContentLoaded', function() {
	app.root = document.getElementById('app');

	app.getCountries();
	app.createModal();
});