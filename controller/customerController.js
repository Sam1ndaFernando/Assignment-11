import { CustomerModel } from "../model/customerModel.js";
import { setCustomerCount } from "./indexController.js";
import { setCustomerIds } from "./orderController.js";

// Initialize customer database array
let customer_db = [];

// Customer form elements
const customer_Id = $('#customerId');
const full_name = $('#fullname');
const address = $('#address');
const contact = $('#contact');
const customer_btns = $('#customer_btn button');
const customer_search = $('#customer_search input');
const customer_search_select = $('#customer_search select');

// Function to load the customer table from customer_db
const loadCustomerTable = function () {
    $('tbody').eq(0).empty();
    customer_db.forEach(customer => {
        $('tbody').eq(0).append(
            `<tr>
                <th scope="row">${customer.customerId}</th>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.contact}</td>
            </tr>`
        );
    });
    setCustomerCount(customer_db.length);
    setCustomerIds(customer_db);
}

// Initial loading of customer table
loadCustomerTable();

/// Function to add customer to customer_db
customer_btns.eq(0).on('click', () => {
    let customerId = customer_Id.val().trim();
    let fullName = full_name.val().trim();
    let addressVal = address.val().trim();
    let contactVal = parseInt(contact.val().trim());

    if (validate(customerId, 'customer Id') && validate(fullName, 'full name') &&
        validate(addressVal, 'address') && validate(contactVal, 'contact')) {

        let customer = new CustomerModel(customerId, fullName, addressVal, contactVal);
        customer_db.push(customer); // Add customer to customer_db array

        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Customer Saved!', '', 'success');
                customer_btns.eq(3).click();
                loadCustomerTable();
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }
});

// Function to update customer in customer_db
customer_btns.eq(1).on('click', () => {
    let customerId = customer_Id.val().trim();
    let fullName = full_name.val().trim();
    let addressVal = address.val().trim();
    let contactVal = parseInt(contact.val().trim());

    if (validate(customerId, 'customer Id') && validate(fullName, 'full name') &&
        validate(addressVal, 'address') && validate(contactVal, 'contact')) {

        let customerIndex = customer_db.findIndex(customer => customer.customerId === customerId);
        if (customerIndex !== -1) {
            customer_db[customerIndex] = new CustomerModel(customerId, fullName, addressVal, contactVal);

            Swal.fire({
                title: 'Do you want to update the customer?',
                showDenyButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Customer Updated!', '', 'success');
                    customer_btns.eq(3).click();
                    loadCustomerTable();
                } else if (result.isDenied) {
                    Swal.fire('Changes are not updated!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Customer not found 😓',
            });
        }
    }
});

// Function to delete customer from customer_db
customer_btns.eq(2).on('click', () => {
    let customerId = customer_Id.val().trim();

    if (validate(customerId, 'customer Id')) {
        let customerIndex = customer_db.findIndex(customer => customer.customerId === customerId);
        if (customerIndex !== -1) {
            customer_db.splice(customerIndex, 1);

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
                    customer_btns.eq(3).click();
                    loadCustomerTable();
                } else if (result.isDenied) {
                    Swal.fire('Changes are not Deleted!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Customer not found 😓',
            });
        }
    }
});

// Function to handle click on customer table row and populate form fields
$('tbody').eq(0).on('click', 'tr', function () {
    customer_Id.val($(this).find('th').eq(0).text());
    full_name.val($(this).find('td').eq(0).text());
    address.val($(this).find('td').eq(1).text());
    contact.val($(this).find('td').eq(2).text());
});

// Function to validate input fields
function validate(value, field_name) {
    if (!value) {
        Swal.fire({
            icon: 'warning',
            title: `Please enter the ${field_name}!`
        });
        return false;
    }
    return true;
}
