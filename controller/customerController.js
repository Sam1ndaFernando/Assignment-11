import { CustomerModel } from "../model/customerModel.js";
import { setCustomerCount } from "./indexController.js";
import { setCustomerIds } from "./orderController.js";

//customer form
const customer_Id = $('#customerId');
const full_name = $('#fullname');
const address = $('#address');
const contact = $('#contact');
const customer_btn = $('#customer_btn button');
const customer_search = $('#customer_search input');
const customer_search_select = $('#customer_search select');

//load the customer table
const loadCustomerTable = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/customer',
        success: function (data) {
            $('tbody').eq(0).empty();
            data.forEach(item => {
                $('tbody').eq(0).append(
                    `<tr>
                    <th scope="row">${item.customerId}</th>
                    <td>${item.name}</td>
                    <td>${item.address}</td>
                    <td>${item.contact}</td>
                    </tr>`
                );
            });
            setCustomerCount(data.length);
            setCustomerIds(data);

        },
        error: function (err) {
            Swal.fire('Something went wrong', '', 'info')
        }
    });
}

loadCustomerTable();

//add customer
customer_btn.eq(0).on('click', () => {
        let customerId = customer_Id.val().trim();
        let fullName = full_name.val().trim();
        let addressVal = address.val().trim();
        let contactVal = parseInt(contact.val().trim());

        if (validate(customerId, 'customer Id') && validate(fullName, 'full name') &&
            validate(addressVal, 'address') && validate(contact, 'contact')) {

            let customer = new CustomerModel(customerId, fullName, addressVal, contactVal);


            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8080/customer',
                        contentType: 'application/json',
                        data: JSON.stringify(customer),
                        success: function (res) {
                            Swal.fire('Customer Saved!', '', 'success');
                            customer_btn.eq(3).click();
                            loadCustomerTable();
                        },
                        error: function (err) {
                            Swal.fire('Changes are not saved', '', 'info')
                        }
                    });

                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            });
        }
    }
);

//update customer
customer_btn.eq(1).on('click', () => {
        let customerId = customer_Id.val().trim();
        let fullName = full_name.val().trim();
        let addressVal = address.val().trim();
        let contactVal = parseFloat(contact.val().trim());

        if (validate(customerId, 'customer Id') && validate(fullName, 'full name') &&
            validate(addressVal, 'address') && validate(contactVal, 'contact')) {

            let customer = new CustomerModel(customerId, fullName, addressVal, contactVal);

            Swal.fire({
                title: 'Do you want to update the customer?',
                showDenyButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'PUT',
                        url: 'http://localhost:8080/customer',
                        contentType: 'application/json',
                        data: JSON.stringify(customer),
                        success: function (res) {
                            Swal.fire('Customer Updated!', '', 'success');
                            customer_btn.eq(3).click();
                            loadCustomerTable();
                        },
                        error: function (err) {
                            Swal.fire('Customer not updated!', '', 'info')
                        }
                    });

                } else if (result.isDenied) {
                    Swal.fire('Changes are not updated!', '', 'info')
                }
            });
        }
    }
);

//delete customer
customer_btn.eq(2).on('click', () => {
        let customerId = customer_Id.val().trim();

        if (validate(customerId, 'customer Id')) {

            const customer = { customerId: customerId }

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
                    $.ajax({
                        type: 'DELETE',
                        url: 'http://localhost:8080/customer',
                        contentType: 'application/json',
                        data: JSON.stringify(customer),
                        success: function (res) {
                            Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
                            customer_btn.eq(3).click();
                            loadCustomerTable();
                        },
                        error: function (err) {
                            Swal.fire('Customer not Deleted!', '', 'info')
                        }
                    });
                } else if (result.isDenied) {
                    Swal.fire('Changes are not Deleted!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Customer did not exists 😓',
            });
        }
    }
);


//load customer
$('tbody').eq(0).on('click', 'tr', function () {
    customer_Id.val($(this).find('th').eq(0).text());
    full_name.val($(this).find('td').eq(0).text());
    address.val($(this).find('td').eq(1).text());
    contact.val($(this).find('td').eq(2).text());
});

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