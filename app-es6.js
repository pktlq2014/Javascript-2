// Local Storage Class
class Contact {
    constructor(name, email, phone, birthday) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthday = birthday;
    }
}

// UI Class
class UI {

    addContactToList(contact) {
        const list = document.getElementById('contact-list');
        // Create tr Element
        const row = document.createElement('tr');
        // Insert Column
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.birthday}</td>
            <td><a class="btn btn-floating delete">x</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(getMsg, getClass) {

        // Create div
        const div = document.createElement('div');
        // Add Classes
        div.className = `alert alert-${getClass}`;
        // Add Text
        div.appendChild(document.createTextNode(getMsg));
        // Get Parent
        const card = document.querySelector('.card');
        // Get Form
        const cardAction = document.querySelector('.card-action');
        // Insert Alert
        // thêm nội dung thẻ div vào trước cardAction
        card.insertBefore(div, cardAction);
        // Timeout 3 Seconds for alert dismiss
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 2000);

    }

    deleteContact(target) {
        // cha của btn xóa là thẻ td, cha của td là thẻ tr -> xóa toàn bộ tr đi
        console.log(target.parentElement.parentElement);
        target.parentElement.parentElement.remove();
        //Remove from LS
        Store.removeContact(target.parentElement.parentElement.children[2].textContent);

        // Show message
        this.showAlert('Contact Removed!', 'danger');


    }

    clearFields() {

        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('birthday').value = '';

    }

    searchName(text) {
        const rows = document.querySelectorAll('#contact-list tr');
        rows.forEach(function (row) {
            // chạy hết all dữ liệu
            // childrent[1] là cột email, 0 là name
            // row.children[0] là thằng con đầu tiên của tr
            // mỗi vòng for chạy 1 dòng lấy data cột name ra so sánh
            if (row.children[0].textContent.indexOf(text) != -1) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            };
        });

    }
}

// Local Storage Class
class Store {
    static getContact() {
        let contact;
        if (localStorage.getItem('contacts') === null) {
            contact = [];
        } else {
            contact = JSON.parse(localStorage.getItem('contacts'));
        }
        return contact;
    }
    static displayContact() {
        const contacts = Store.getContact();
        contacts.forEach(function (contact) {
            const ui = new UI();
            // Add book to UI
            ui.addContactToList(contact);
        });
    }
    static addContact(contact) {
        //Books from LocalStorage
        const contacts = Store.getContact();
        // Push New book into book array with previous array
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(phone) {
        const contacts = Store.getContact();
        contacts.forEach((contact, index) => {
            if (contact.phone === phone) {
                // bắt đầu từ vị trí index xóa đi 1 phần tử
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayContact());

// Submit Event Listener
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Get Form Values
    const name = document.getElementById('name').value,
        email = document.getElementById('email').value,
        phone = document.getElementById('phone').value;
    birthday = document.getElementById('birthday').value;
    // Instantiate Contact
    const contact = new Contact(name, email, phone, birthday);
    // Instantiate UI
    const ui = new UI();
    // Validate
    if (name === '' || phone === '') {
        // Show Progress
        document.querySelector('.progress').style.display = 'block';
        setTimeout(function () {
            // hide Progress
            document.querySelector('.progress').style.display = 'none';
            // Error Alert
            ui.showAlert('Please fill Name & Phone Fields at least', 'danger');
        }, 500);
    } else {
        // Show Progress
        document.querySelector('.progress').style.display = 'block';
        setTimeout(function () {
            // hide Progress
            document.querySelector('.progress').style.display = 'none';
            //Add contact to list
            ui.addContactToList(contact);
            // Add contact to Local Storage
            Store.addContact(contact);
            // Show Success
            ui.showAlert('New Contact Added!', 'success');
            // Clear Fields
            ui.clearFields();
        }, 1000);
    }
});

// bắt event click cho thằng cha
document.getElementById('contact-list').addEventListener('click', function (e) {

    // Instantiate UI
    const ui = new UI();
    // khi click vào thằng con nào chứa class delete
    if (e.target.classList.contains('delete')) {

        if (confirm('Are you sure?')) {

            // Show Progress
            document.querySelector('.progress').style.display = 'block';

            // Timeout 1 Second
            setTimeout(function () {

                document.querySelector('.progress').style.display = 'none';

                ui.deleteContact(e.target);
            }, 1000);

        }

    }
    e.preventDefault();
});

// Search / Filter 
document.getElementById('search').addEventListener('keyup', function (e) {
    const ui = new UI();
    ui.searchName(e.target.value);
});

