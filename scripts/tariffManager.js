// Tariff Management
const TariffManager = {
    create(tariff) {
        const tariffs = StorageManager.getData('tariffs');
        tariff.id = Date.now();
        tariffs.push(tariff);
        StorageManager.saveData('tariffs', tariffs);
        this.render();
    },

    update(id, updatedTariff) {
        const tariffs = StorageManager.getData('tariffs');
        const index = tariffs.findIndex(t => t.id === id);
        if (index !== -1) {
            tariffs[index] = { ...tariffs[index], ...updatedTariff };
            StorageManager.saveData('tariffs', tariffs);
            this.render();
        }
    },

    delete(id) {
        if (confirm('Tem a certeza de que deseja eliminar esta tarifa?')) {
            const tariffs = StorageManager.getData('tariffs').filter(t => t.id !== id);
            StorageManager.saveData('tariffs', tariffs);
            this.render();
        }
    },

    render() {
        const tariffs = StorageManager.getData('tariffs');
        const tariffList = document.getElementById('tariff-list');
        const totalTariffs = document.getElementById('total-tariffs');
        const averageTariff = document.getElementById('average-tariff');

        tariffList.innerHTML = '';
        let totalPrice = 0;

        tariffs.forEach(tariff => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tariff.category}</td>
                <td>${tariff.description}</td>
                <td>€${parseFloat(tariff.price).toFixed(2)}</td>
                <td>${tariff.season}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTariff(${tariff.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="TariffManager.delete(${tariff.id})">Eliminar</button>
                </td>
            `;
            tariffList.appendChild(row);
            totalPrice += parseFloat(tariff.price);
        });

        totalTariffs.textContent = tariffs.length;
        averageTariff.textContent = tariffs.length > 0 ? `€${(totalPrice / tariffs.length).toFixed(2)}` : '€0.00';
    }
};

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