// Utility Functions for Modal Interactions

function editRoom(id) {
    const rooms = StorageManager.getData('rooms');
    const room = rooms.find(r => r.id === id);
    if (room) {
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-type').value = room.type;
        document.getElementById('room-capacity').value = room.capacity;
        document.getElementById('room-price').value = room.price;
        document.getElementById('room-status').value = room.status;
        document.getElementById('room-photo').value = room.photo || '';

        const roomModal = new bootstrap.Modal(document.getElementById('roomModal'));
        roomModal.show();
    }
}

function editReservation(id) {
    const reservations = StorageManager.getData('reservations');
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        document.getElementById('reservation-id').value = reservation.id;
        document.getElementById('reservation-name').value = reservation.name;
        document.getElementById('reservation-email').value = reservation.email; // Edit email
        document.getElementById('reservation-room').value = reservation.roomId;
        document.getElementById('reservation-checkin').value = reservation.checkin;
        document.getElementById('reservation-checkout').value = reservation.checkout;

        const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
        reservationModal.show();
    }
}

function editTariff(id) {
    const tariffs = StorageManager.getData('tariffs');
    const tariff = tariffs.find(t => t.id === id);
    if (tariff) {
        document.getElementById('tariff-id').value = tariff.id;
        document.getElementById('tariff-category').value = tariff.category;
        document.getElementById('tariff-description').value = tariff.description;
        document.getElementById('tariff-price').value = tariff.price;
        document.getElementById('tariff-season').value = tariff.season;

        const tariffModal = new bootstrap.Modal(document.getElementById('tariffModal'));
        tariffModal.show();
    }
}

// Save Functions
function saveRoom() {
    const id = parseInt(document.getElementById('room-id').value);
    const room = {
        type: document.getElementById('room-type').value,
        capacity: document.getElementById('room-capacity').value,
        price: document.getElementById('room-price').value,
        status: document.getElementById('room-status').value,
        photo: document.getElementById('room-photo').value
    };

    if (id) {
        RoomManager.update(id, room);
    } else {
        RoomManager.create(room);
    }

    bootstrap.Modal.getInstance(document.getElementById('roomModal')).hide();
}

function saveReservation() {
    const id = parseInt(document.getElementById('reservation-id').value);
    const reservation = {
        name: document.getElementById('reservation-name').value,
        email: document.getElementById('reservation-email').value, // Save email
        roomId: document.getElementById('reservation-room').value,
        checkin: document.getElementById('reservation-checkin').value,
        checkout: document.getElementById('reservation-checkout').value
    };

    // Debugging log to check the reservation data before saving
    console.log('Reservation data to be saved:', reservation);

    let success = false;
    if (id) {
        ReservationManager.update(id, reservation);
        success = true;
    } else {
        success = ReservationManager.create(reservation);
    }

    if (success) {
        bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
    }
}

function saveTariff() {
    const id = parseInt(document.getElementById('tariff-id').value);
    const tariff = {
        category: document.getElementById('tariff-category').value,
        description: document.getElementById('tariff-description').value,
        price: document.getElementById('tariff-price').value,
        season: document.getElementById('tariff-season').value
    };

    if (id) {
        TariffManager.update(id, tariff);
    } else {
        TariffManager.create(tariff);
    }

    bootstrap.Modal.getInstance(document.getElementById('tariffModal')).hide();
}