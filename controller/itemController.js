import { ItemModel } from "../model/itemModel.js";
import { setItemCount } from "./indexController.js";
import { setItemIds } from "./orderController.js";

// Initialize item database array
let item_db = [];

//item form
const item_Code = $('#itemCode');
const description = $('#description');
const unit_price = $('#unitPrice');
const qty = $('#qty');
const item_btns = $('#item_btn button');
const item_search = $('#item_search input');
const item_search_select = $('#item_search select');

// Add item to item_db array
item_btns.eq(0).on('click', () => {
    let itemCode = item_Code.val().trim();
    let desc = description.val().trim();
    let price = parseFloat(unit_price.val().trim());
    let qty_val = parseInt(qty.val());

    if (validate(itemCode, 'item code') && validate(desc, 'description') &&
        validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

        let item = new ItemModel(itemCode, desc, price, qty_val);
        item_db.push(item); // Add item to item_db array

        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Item Saved!', '', 'success');
                item_btns.eq(3).click();
                loadItemTable();
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }
});

// Update item in item_db array
item_btns.eq(1).on('click', () => {
    let itemCode = item_Code.val().trim();
    let desc = description.val().trim();
    let price = parseFloat(unit_price.val().trim());
    let qty_val = parseInt(qty.val());

    if (validate(itemCode, 'item code') && validate(desc, 'description') &&
        validate(price, 'unit price') && validate(qty_val, 'qty on hand')) {

        let itemIndex = item_db.findIndex(item => item.itemId === itemCode);
        if (itemIndex !== -1) {
            item_db[itemIndex] = new ItemModel(itemCode, desc, price, qty_val);

            Swal.fire({
                title: 'Do you want to update the item?',
                showDenyButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Item Updated!', '', 'success');
                    item_btns.eq(3).click();
                    loadItemTable();
                } else if (result.isDenied) {
                    Swal.fire('Changes are not updated!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Item not found 😓',
            });
        }
    }
});

// Delete item from item_db array
item_btns.eq(2).on('click', () => {
    let itemCode = item_Code.val().trim();

    if (validate(itemCode, 'item code')) {
        let itemIndex = item_db.findIndex(item => item.itemId === itemCode);
        if (itemIndex !== -1) {
            item_db.splice(itemIndex, 1);

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
                    Swal.fire('Deleted!', 'Your Item has been deleted.', 'success');
                    item_btns.eq(3).click();
                    loadItemTable();
                } else if (result.isDenied) {
                    Swal.fire('Changes are not Deleted!', '', 'info')
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Item not found 😓',
            });
        }
    }
});

// Load item table from item_db array
$('tbody').eq(1).on('click', 'tr', function () {
    item_Code.val($(this).find('th').eq(0).text());
    description.val($(this).find('td').eq(0).text());
    unit_price.val($(this).find('td').eq(1).text());
    qty.val($(this).find('td').eq(2).text());
});

// Function to load the item table
export const loadItemTable = function () {
    $('tbody').eq(1).empty();
    item_db.forEach(item => {
        $('tbody').eq(1).append(
            `<tr>
                <th scope="row">${item.itemId}</th>
                <td>${item.description}</td>
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
            </tr>`
        );
    });
    setItemCount(item_db.length);
    setItemIds(item_db);
};

loadItemTable(); // Initial loading of item table

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
