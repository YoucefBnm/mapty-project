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

class Workout {
    date = new Date()
    id = (Date.now() + '').slice(-10)
    
    constructor(coords, distance, duration) {
        this.coords = coords // [lat, lng]
        this.distance = distance // in km
        this.duration = duration // in minutes
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace()
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance
        return this.pace
    }
}
class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain
        this.calcSpeed()
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }
}

const run1 = new Running([39, -13], 5.2, 24, 179)
const cycle1 = new Cycling([39, -13], 25.2, 99, 579)
console.log(run1, cycle1)

// instead of defining them in global-scope
// => declare map & mapEvent as private prop in App class
// let map, mapEvent
// APPLICATION Architecture
class App {
    // private
    #map;
    #mapEvent
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
                alert('You\'re not on earth!! Could not get your position')
            })
        }        
    }

    _loadMap(position) {
        const {latitude} = position.coords
        const {longitude} = position.coords
        const coords = [latitude, longitude]
        // 'map' is the id in html 
        // '13' is the level of zoom
        this.#map = L.map('map').setView(coords, 5);
        // change the default look of 'streetmap' by another
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        // handle clicks on map
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        // show form on click 
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(e) {
        e.preventDefault()
        // clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
        const { lat, lng } = this.#mapEvent.latlng
        // display marker
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
                }))
                .setPopupContent('Workout')
                .openPopup();
    }
}

const app = new App()



