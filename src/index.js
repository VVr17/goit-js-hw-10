import './css/styles.css';
import API from './fetchCountries';

// библиотека notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import Tpl from './template/country-card.hbs';

const DEBOUNCE_DELAY = 300;
const { fetchCountries } = API;
var debounce = require('lodash.debounce');

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryCard: document.querySelector('.country-info'),
  countryList:document.querySelector('.country-list'),
}

refs.searchInput.addEventListener('input', debounce(onInput,DEBOUNCE_DELAY))

function onInput(event) {

  const trimmedInput = event.target.value.trim();

  if(refs.countryCard) {
    refs.countryCard.textContent = '';
  }

  if(refs.countryList) {
    refs.countryList.textContent = '';
  }

  if(!trimmedInput) {
    Notify.warning('Field cannot be empty. Please, enter country');
    return;
  }

  fetchCountries(trimmedInput)
  .then(countries => {

    if(Number(countries.length) > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    if (Number(countries.length) === 1) {
      renderCountryCard(countries[0])
    } else {
      renderCountriesList(countries)
    }
  })
  .catch(error => console.log(error))
}  

  function renderCountryCard(country) {

    const {
      name,
      capital,
      population,
      flags, 
      languages
    } = country

    const markup = `
    <div class="card">
  <img class="card-img" src="${flags.svg}" alt="${name.official}">

  <div class="card-body">    
    <h2 class="card-title">Официальное название: ${name.official}</h2>
    <p class="card-text">Столица: ${capital}</p>
    <p class="card-text">Население: ${population}</p>
    <p class="card-text">Языки: ${Object.values(languages).join(', ')}
    </p>
  </div>
</div>`;
    refs.countryCard.insertAdjacentHTML('beforeend',markup)
  }

  function renderCountriesList(countries) {

    let countriesListMarkup = [];

    countries.map(({ name, flags }) => {
      
      const markup = `
      <li class="country-item">
        <img src="${flags.svg}" alt="${name.common}">
        <h2 class="country-item__title"> ${name.common}</h2>
      </li>
      `

      countriesListMarkup.push(markup);
    })

    refs.countryList.insertAdjacentHTML('beforeend',countriesListMarkup.join(''))
  }


