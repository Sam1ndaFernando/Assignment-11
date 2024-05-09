import { ItemModel } from "../model/itemModel.js";
import { setItemCount } from "./indexController.js";
import { setItemIds } from "./orderController.js";

//item form
const item_Code = $('#itemCode');
const description = $('#description');
const unit_price = $('#unitPrice');
const qty = $('#qty');
const item_btns = $('#item_btn button');
const item_search = $('#item_search input');
const item_search_select = $('#item_search select');

//add item
item_btns.eq(0).on('click', () => {
    let itemCode = item_Code.val().trim();
    let desc = description.val().trim();
    let price = parseFloat(unit_price.val().trim());
    let qty_val = parseInt(qty.val());

    if (validate(itemCode, 'item code') && validate(desc, 'description') &&
        validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

        let item = new ItemModel(itemCode, desc, price, qty_val);

        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/item',
                    contentType: 'application/json',
                    data: JSON.stringify(item),
                    success: function (res) {
                        Swal.fire('Item Saved!', '', 'success');
                        item_btns.eq(3).click();
                        loadItemTable();
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
});

//update item
item_btns.eq(1).on('click', () => {
    let itemCode = item_Code.val().trim();
    let desc = description.val().trim();
    let price = parseFloat(unit_price.val().trim());
    let qty_val = parseInt(qty.val());

    if (validate(itemCode, 'item code') && validate(desc, 'description') &&
        validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

        let item = new ItemModel(itemCode, desc, price, qty_val);

        Swal.fire({
            title: 'Do you want to update the item?',
            showDenyButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:8080/item',
                    contentType: 'application/json',
                    data: JSON.stringify(item),
                    success: function (res) {
                        Swal.fire('Item Updated!', '', 'success');
                        item_btns.eq(3).click();
                        loadItemTable();
                    },
                    error: function (err) {
                        Swal.fire('Item not updated!', '', 'info')
                    }
                });

            } else if (result.isDenied) {
                Swal.fire('Changes are not updated!', '', 'info')
            }
        });
    }
});

//delete item
item_btns.eq(2).on('click', () => {
    let itemCode = item_Code.val().trim();

    if (validate(itemCode, 'item code')) {

        const item = { itemId: itemCode }

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
                    url: 'http://localhost:8080/item',
                    contentType: 'application/json',
                    data: JSON.stringify(item),
                    success: function (res) {
                        Swal.fire('Deleted!', 'Your Item has been deleted.', 'success');
                        item_btns.eq(3).click();
                        loadItemTable();
                    },
                    error: function (err) {
                        Swal.fire('Customer not Deleted!', '', 'info')
                    }
                });
            }
        });
    }
});

//load item
$('tbody').eq(1).on('click', 'tr', function () {
    item_Code.val($(this).find('th').eq(0).text());
    description.val($(this).find('td').eq(0).text());
    unit_price.val($(this).find('td').eq(1).text());
    qty.val($(this).find('td').eq(2).text());
});

//load the item table
export const loadItemTable = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/item',
        success: function (data) {
            $('tbody').eq(1).empty();
            data.forEach(item => {
                $('tbody').eq(1).append(
                    `<tr>
                    <th scope="row">${item.itemId}</th>
                    <td>${item.description}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.qty}</td>
                    </tr>`
                );
            });
            setItemCount(data.length);
            setItemIds(data);
        },
        error: function (err) {
            Swal.fire('Something went wrong', '', 'info')
        }
    });
}

loadItemTable();

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

