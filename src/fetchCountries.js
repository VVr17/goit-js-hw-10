// https://restcountries.com/
// https://restcountries.com/v3.1/name/{name}

/* 
name.official - полное имя страны
capital - столица
population - население
flags.svg - ссылка на изображение флага
languages - массив языков
*/
// библиотека notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';


function fetchCountries(name ='') {

  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
      if (!response.ok) {
        Notify.failure('Oops, there is no country with that name');
        throw new Error(response.status);
      }
      return response.json();
    })
}

export default { fetchCountries };