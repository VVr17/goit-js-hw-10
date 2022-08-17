import './css/styles.css';
import API from './fetchCountries';

import countryCardTemplate from './template/country-card.hbs'; 
import countriesListTemplate from './template/country-info.hbs'; 

// библиотека notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';


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

    const markup = countryCardTemplate(country);
    refs.countryCard.insertAdjacentHTML('beforeend',markup)
  }

  function renderCountriesList(countries) {

    let countriesListMarkup = [];

    countries.map(country => {
      
      const {
        name,
        capital,
        population,
        flags, 
        languages
      } = country

      countriesListMarkup.push(countriesListTemplate(country));
    })

    refs.countryList.insertAdjacentHTML('beforeend',countriesListMarkup.join(''))
  }


