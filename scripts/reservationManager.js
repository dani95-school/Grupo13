// Reservation Management
const ReservationManager = {
    create(reservation) {
        const reservations = StorageManager.getData('reservations');
        const rooms = StorageManager.getData('rooms');
        const tariffs = StorageManager.getData('tariffs');

        // Check if the reservation is within the current year
        const currentYear = new Date().getFullYear();
        const checkinDate = new Date(reservation.checkin);
        const checkoutDate = new Date(reservation.checkout);

        if (checkinDate.getFullYear() !== currentYear || checkoutDate.getFullYear() !== currentYear) {
            alert('As reservas só podem ser feitas no ano atual.');
            return false;
        }

        // Check if the reservation dates are not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        if (checkinDate < today || checkoutDate <= today) {
            alert('Não é possível reservar em dias que já passaram.');
            return false;
        }

        // Check room availability
        const conflictingReservation = reservations.find(r =>
            r.roomId === reservation.roomId &&
            !(new Date(reservation.checkout) <= new Date(r.checkin) ||
                new Date(reservation.checkin) >= new Date(r.checkout))
        );

        if (conflictingReservation) {
            alert('Este quarto já está reservado para o período selecionado.');
            return false;
        }

        // Determine season
        const season = this.determineSeason(checkinDate);

        // Find room and apply appropriate pricing
        const room = rooms.find(r => r.id === parseInt(reservation.roomId));
        const seasonalTariff = tariffs.find(t =>
            t.category === room.type &&
            t.season === season
        );

        // Calculate nights and total price
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        // Price calculation prioritizing seasonal tariffs
        const pricePerNight = seasonalTariff ? parseFloat(seasonalTariff.price) : parseFloat(room.price);

        reservation.id = Date.now();
        reservation.totalPrice = nights * pricePerNight;
        reservation.nights = nights;
        reservation.season = season;

        // Debugging log to check reservation object
        console.log('Reservation object before saving:', reservation);

        // Add reservation without changing room status
        reservations.push(reservation);
        StorageManager.saveData('reservations', reservations);
        this.render();
        return true;
    },

    determineSeason(date) {
        const month = date.getMonth();
        const day = date.getDate();

        // Holiday checks
        const isEaster = this.isEasterPeriod(date);
        const isChristmas = this.isChristmasPeriod(date);
        const isSummer = month >= 6 && month <= 8; // June to August

        if (isChristmas || isEaster) {
            return 'Alta';
        }

        if (isSummer) {
            return 'Alta';
        }

        // Shoulder seasons
        if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) {
            return 'Média';
        }

        return 'Baixa';
    },

    calculateEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    },

    isEasterPeriod(date) {
        const year = date.getFullYear();
        const easterDate = this.calculateEaster(year);

        const easterWeekStart = new Date(easterDate);
        easterWeekStart.setDate(easterDate.getDate() - 7);

        const easterWeekEnd = new Date(easterDate);
        easterWeekEnd.setDate(easterDate.getDate() + 7);

        return date >= easterWeekStart && date <= easterWeekEnd;
    },

    isChristmasPeriod(date) {
        const year = date.getFullYear();
        const christmasStart = new Date(year, 11, 18); // Dec 18
        const christmasEnd = new Date(year, 11, 31);   // Dec 31

        return date >= christmasStart && date <= christmasEnd;
    },

    update(id, updatedReservation) {
        const reservations = StorageManager.getData('reservations');
        const rooms = StorageManager.getData('rooms');
        const tariffs = StorageManager.getData('tariffs');
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            // Check if the reservation is within the current year
            const currentYear = new Date().getFullYear();
            const checkinDate = new Date(updatedReservation.checkin);
            const checkoutDate = new Date(updatedReservation.checkout);

            if (checkinDate.getFullYear() !== currentYear || checkoutDate.getFullYear() !== currentYear) {
                alert('As reservas só podem ser feitas no ano atual.');
                return false;
            }

            // Check if the reservation dates are not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
            if (checkinDate < today || checkoutDate <= today) {
                alert('Não é possível reservar em dias que já passaram.');
                return false;
            }

            // Check room availability
            const conflictingReservation = reservations.find(r =>
                r.roomId === updatedReservation.roomId &&
                r.id !== id && // Exclude the current reservation being updated
                !(new Date(updatedReservation.checkout) <= new Date(r.checkin) ||
                    new Date(updatedReservation.checkin) >= new Date(r.checkout))
            );

            if (conflictingReservation) {
                alert('Este quarto já está reservado para o período selecionado.');
                return false;
            }

            // Determine season
            const season = this.determineSeason(checkinDate);

            // Find room and apply appropriate pricing
            const room = rooms.find(r => r.id === parseInt(updatedReservation.roomId));
            const seasonalTariff = tariffs.find(t =>
                t.category === room.type &&
                t.season === season
            );

            // Calculate nights and total price
            const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

            // Price calculation prioritizing seasonal tariffs
            const pricePerNight = seasonalTariff ? parseFloat(seasonalTariff.price) : parseFloat(room.price);

            updatedReservation.totalPrice = nights * pricePerNight;
            updatedReservation.nights = nights;
            updatedReservation.season = season;

            reservations[index] = { ...reservations[index], ...updatedReservation };
            StorageManager.saveData('reservations', reservations);
            this.render();
            return true;
        }
        return false;
    },

    delete(id) {
        if (confirm('Tem a certeza de que deseja eliminar esta reserva?')) {
            const reservations = StorageManager.getData('reservations');
            const filteredReservations = reservations.filter(r => r.id !== id);
            StorageManager.saveData('reservations', filteredReservations);
            this.render();
        }
    },

    render() {
        const reservations = StorageManager.getData('reservations');
        const reservationList = document.getElementById('reservation-list');
        const totalReservations = document.getElementById('total-reservations');
        const totalRevenue = document.getElementById('total-revenue');
        const expectedMonthlyRevenue = document.getElementById('expected-monthly-revenue');
        const expectedAnnualRevenue = document.getElementById('expected-annual-revenue');
        const totalReservedDays = document.getElementById('total-reserved-days');
    
        reservationList.innerHTML = '';
        let totalRevenueAmount = 0;
        let monthlyRevenue = 0;
        let annualRevenue = 0;
        let reservedDays = 0;
    
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        reservations.forEach(reservation => {
            const checkinDate = new Date(reservation.checkin);
            const checkoutDate = new Date(reservation.checkout);
    
            // Calcular a quantidade de dias reservados
            const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            reservedDays += nights;
    
            // Calcular a receita total
            totalRevenueAmount += parseFloat(reservation.totalPrice);
    
            // Calcular a receita mensal esperada
            if (checkinDate.getMonth() === currentMonth && checkinDate.getFullYear() === currentYear) {
                monthlyRevenue += parseFloat(reservation.totalPrice);
            }
    
            // Calcular a receita anual esperada
            if (checkinDate.getFullYear() === currentYear) {
                annualRevenue += parseFloat(reservation.totalPrice);
            }
    
            // Adicionar a reserva à lista
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.name}</td>
                <td>${reservation.email}</td>
                <td>${reservation.roomId}</td>
                <td>${reservation.checkin} - ${reservation.checkout}</td>
                <td>€${parseFloat(reservation.totalPrice).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editReservation(${reservation.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="ReservationManager.delete(${reservation.id})">Eliminar</button>
                </td>
            `;
            reservationList.appendChild(row);
        });
    
        // Atualizar os dados no resumo
        totalReservations.textContent = reservations.length;
        totalRevenue.textContent = `€${totalRevenueAmount.toFixed(2)}`;
        expectedMonthlyRevenue.textContent = `€${monthlyRevenue.toFixed(2)}`;
        expectedAnnualRevenue.textContent = `€${annualRevenue.toFixed(2)}`;
        totalReservedDays.textContent = reservedDays;
    }    
};

function editReservation(id) {
    const reservations = StorageManager.getData('reservations');
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        document.getElementById('reservation-id').value = reservation.id;
        document.getElementById('reservation-name').value = reservation.name;
        document.getElementById('reservation-email').value = reservation.email;
        document.getElementById('reservation-room').value = reservation.roomId;
        document.getElementById('reservation-checkin').value = reservation.checkin;
        document.getElementById('reservation-checkout').value = reservation.checkout;

        const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
        reservationModal.show();
    }
}

function saveReservation() {
    const id = parseInt(document.getElementById('reservation-id').value);
    const reservation = {
        name: document.getElementById('reservation-name').value,
        email: document.getElementById('reservation-email').value,
        roomId: document.getElementById('reservation-room').value,
        checkin: document.getElementById('reservation-checkin').value,
        checkout: document.getElementById('reservation-checkout').value
    };

    // Debugging log to check the reservation data before saving
    console.log('Reservation data to be saved:', reservation);

    let success = false;
    if (id) {
        success = ReservationManager.update(id, reservation);
    } else {
        success = ReservationManager.create(reservation);
    }

    if (success) {
        bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
    }
}