// Room Management
const RoomManager = {
    create(room) {
        const rooms = StorageManager.getData('rooms');
        room.id = Date.now();
        rooms.push(room);
        StorageManager.saveData('rooms', rooms);
        this.render();
        this.populateRoomSelect();
    },
    update(id, updatedRoom) {
        const rooms = StorageManager.getData('rooms');
        const index = rooms.findIndex(room => room.id === id);
        if (index !== -1) {
            rooms[index] = { ...rooms[index], ...updatedRoom };
            StorageManager.saveData('rooms', rooms);
            this.render();
            this.populateRoomSelect();
        }
    },
    delete(id) {
        if (confirm('Tem a certeza de que deseja eliminar este quarto?')) {
            const rooms = StorageManager.getData('rooms').filter(room => room.id !== id);
            StorageManager.saveData('rooms', rooms);
            this.render();
            this.populateRoomSelect();
        }
    },
    render() {
        const rooms = StorageManager.getData('rooms');
        const roomList = document.getElementById('room-list');
        const totalRooms = document.getElementById('total-rooms');
        const availableRooms = document.getElementById('available-rooms');
        const occupiedRooms = document.getElementById('occupied-rooms');

        roomList.innerHTML = '';
        let availableCount = 0, occupiedCount = 0;

        rooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.type}</td>
                <td>${room.capacity}</td>
                <td>€${parseFloat(room.price).toFixed(2)}</td>
                <td class="status-${room.status.toLowerCase()}">${room.status}</td>
                <td><img src="${room.photo}" alt="Foto do quarto" class="room-photo" style="width: 100px; height: auto;"></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editRoom(${room.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="RoomManager.delete(${room.id})">Eliminar</button>
                </td>
            `;
            roomList.appendChild(row);

            room.status === 'Disponível' ? availableCount++ : occupiedCount++;
        });

        totalRooms.textContent = rooms.length;
        availableRooms.textContent = availableCount;
        occupiedRooms.textContent = occupiedCount;
    },
    populateRoomSelect() {
        const rooms = StorageManager.getData('rooms');
        const roomSelect = document.getElementById('reservation-room');
        roomSelect.innerHTML = '<option value="">Selecione um Quarto</option>';
        rooms.forEach(room => {
            if (room.status === 'Disponível') {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${room.type} (${room.capacity} pessoas)`;
                roomSelect.appendChild(option);
            }
        });
    }
};

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
