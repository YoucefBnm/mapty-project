'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent

navigator.geolocation.getCurrentPosition(
    // takes two function, one for success and one for error
    function(position){
        const {latitude} = position.coords
        const {longitude} = position.coords
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`)

        const coords = [latitude, longitude]
        // 'map' is the id in html 
        // '13' is the level of zoom
        map = L.map('map').setView(coords, 5);
    // change the default look of 'streetmap' by another
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // handle clicks on map
    map.on('click', (mapE) => {
        mapEvent = mapE
        // show form on click 
        form.classList.remove('hidden')
        inputDistance.focus()
    
     })

}, function() {
    alert('you\'re not on earth!! could not get your position')
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
    // display marker
    const { lat, lng } = mapEvent.latlng

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup'
            }))
            .setPopupContent('Workout')
            .openPopup();
})

inputType.addEventListener('change', () => {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})