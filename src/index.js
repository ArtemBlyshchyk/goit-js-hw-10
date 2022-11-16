import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import FetchCountries from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const { searchInput, countryList } = {
    searchInput: document.querySelector("#search-box"),
    countryList: document.querySelector(".country-list"),
  }
  
  const countriesApiService = new FetchCountries();
  
  //TODO Callback Listener for Search Input
  function onSearchInput(evt) {
    countriesApiService.searchQuery = evt.target.value.toLowerCase().trim();
    if (!countriesApiService.searchQuery) {
      return clearMarkup()
    }
    countriesApiService.fetchCountries()
      .then(createMarkup)
      .catch(onError)
  }
  

  searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY))
  
  
  //TODO Error if nothing is found 
  
  function onError() {
    clearMarkup();
    Notify.failure('Oops, there is no country with that name')
  }
  
  
  //TODO Create Markup depending on the number of countries
  
  function createMarkup(data) {
    if (data.length > 10) {
      clearMarkup();
      Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (data.length >= 2 && data.length <= 10) {
      renderCountry(data, markupSetCountry);
    } else {
      renderCountry(data, markupCountry);
    }
  }
  
  function clearMarkup() {
    countryList.innerHTML = ""
  }
  
  function markupSetCountry(data) {
    return /* html */ `<li class="list__item--set"><img src="${data.flags.svg}" alt="${data.flag}" width=25 height=15><span>&nbsp;${data.name.official}</span></li>`
  }
  
  function markupCountry(data) {
    return /* html */ `<li class="list__item--one">
      <img src="${data.flags.svg}" alt="${data.flag}" width=50><span>&nbsp;${data.name.official}</span>
      <p class="item__text"><b>Capital:</b>&nbsp;${data.capital}</p>
      <p class="item__text"><b>Population:</b>&nbsp;${data.population}</p>
      <p class="item__text"><b>Languages:</b>&nbsp;${Object.values(data.languages).join(', ')}</p>
      </li>`
  }
  
  function renderCountry(data, markupFunction) {
    const markup = data.map(markupFunction).join('');
    countryList.innerHTML = markup;
  }