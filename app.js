// klasa tworząca hotel 1
class Hotel {
    constructor(logo, name, country, city, rooms, booked) {
        this.logo = logo;
        this.name = name;
        this.country = country;
        this.city = city;
        this.rooms = rooms;
        this.booked = booked;
        
    }
}

//klasa funkcjonalności użytkownika 2
class UI {
    static displayHotels() {
        
        const hotels = Store.getHotels(); //przekazujemy tablice hoteli do stałej hotels 3
        
        hotels.forEach((hotel) => UI.addHotelToList(hotel)); //petla przez obiekty i przekazanie do ui 4
    }

    //utworzenie metody, pobranie klasy css do zmiennej list, tworzenie wierszy, przekazanie właściwości hotel obiektu 5
    static addHotelToList(hotel) { 
        const list = document.querySelector('#book-list');

        

        
        const row = document.createElement('tr');

        row.innerHTML = `
        <td><img style="width: 60px;" src="${hotel.logo}"></td>
        <td>${hotel.name}</td>
        <td><img style="width: 20px;" src="https://lipis.github.io/flag-icon-css/flags/4x3/${hotel.country.toLowerCase()}.svg"></td>
        <td>${hotel.city}</td>
        <td>${((hotel.booked / hotel.rooms)*100)}%</td>
        <td>${hotel.rooms}</td>
        <td>${hotel.booked}</td>
        <td><a href="#" class="btn btn-danger delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteHotel(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
        };

// 10 metoda ktora czyści inputy po wyslaniu
    static clearFields() {
        document.querySelector('#logo').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#city').value = '';
        document.querySelector('#rooms').value = '';
        document.querySelector('#booked').value = '';
    }
}

//Store class: handles Storage
class Store {
    static getHotels() {
        let hotels;
        if(localStorage.getItem('hotels') === null) {
            hotels = [];
        } else {
            hotels = JSON.parse(localStorage.getItem('hotels'));
        }
        return hotels;
    }

    static addHotel(hotel) {
        const hotels = Store.getHotels();
        hotels.push(hotel);
        localStorage.setItem('hotels', JSON.stringify(hotels));
    }

    static removeHotel(booked) {
        const hotels = Store.getHotels();
        hotels.forEach((hotel, index) => {
            if(hotel.booked === booked) {
                hotels.splice(index, 1);
            }
        });
        localStorage.setItem('hotels', JSON.stringify(hotels));
    }
}



// Event: Display Hotels 6
document.addEventListener('DOMContentLoaded', UI.displayHotels);

// Event addHotels 7
document.querySelector('#book-form').addEventListener('submit', (e) => {
    
    e.preventDefault();
    const logo = document.querySelector('#logo').value;
    const name = document.querySelector('#name').value;
    const country = document.querySelector('#country').value;
    const city = document.querySelector('#city').value;
    const rooms = document.querySelector('#rooms').value;
    const booked = document.querySelector('#booked').value;

// validate

if(name === '' || rooms === '' || booked === '') {
    UI.showAlert('Please fill data in all fields', 'danger');
} else {
// Utworzenie instacji Hotel 8
const hotel = new Hotel(logo, name, country, city, rooms, booked);

// Dodanie hotelu do UI listy
UI.addHotelToList(hotel);

// Dodawania hotelu do pamieci
Store.addHotel(hotel);

// alert o powodzeniu dodania
UI.showAlert('Hotel Added', 'success');

// czyszczenie inputow po wyslaniu danych podpiecie metody po class UI 11
UI.clearFields();
}
});
document.querySelector('#book-list').addEventListener('click', (e) =>
{
    //usuwanie hotelu z ui
    UI.deleteHotel(e.target);
    //usuwanie hotelu z pamieci
    Store.removeHotel(e.target.parentElement.previousElementSibling.innerHTML);

    UI.showAlert('Hotel removed', 'danger');
});

