import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const inputSearch = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');

inputSearch.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const name = inputSearch.value.trim();
  if (name === '') {
    clearMurcup();
    return;
  }
  clearMurcup();

  fetchCountries(name).then(searchResult).catch(showError);
}

function searchResult(name) {
  if (name.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (name.length > 1 && name.length < 10) {
    createCountriesList(name);
  } else {
    createCountryInfo(name);
  }
}

function createCountriesList(name) {
  name.map(({ flags, name }) => {
    const murcup = `<li class="list-item"><img src="${flags.svg}" width="40" height="25" alt="Flag of ${name.official}" /><p class="country-name">${name.official}</p></li>`;
    countryList.innerHTML += murcup;
  });
}

function createCountryInfo(name) {
  name.map(({ flags, name, capital, population, languages }) => {
    const murcup = `<div class="country-list-item"><img src="${
      flags.svg
    }" width="50" height="35" alt="Flag of ${name.official}" />
      <h2 class="country-main-name">${name.official}</h2></div>
      <p class="country-description"><b>Capital:</b> ${capital}</p>
      <p class="country-description"><b>Population:</b> ${population}</p>
      <p class="country-description"><b>Languages:</b> ${Object.values(
        languages
      ).join(', ')}</p>`;
    countryList.innerHTML = murcup;
  });
}

function showError() {
  Notify.failure('Oops, there is no country with that name.');
}

function clearMurcup() {
  countryList.innerHTML = '';
}
