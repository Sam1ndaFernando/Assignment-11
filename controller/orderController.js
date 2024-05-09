import {OrderModel} from "../model/orderModel.js";
import {OrderDetailModel} from "../model/orderDetailModel.js";
import {loadOrderTable} from "./orderDetailController.js";
import {loadItemTable} from "./itemController.js";

const order_id = $('#order_Id');
const customer_id = $('#custId');
const date = $('#orderDate');
const item_Id = $('#item_Id');
const order_qty = $('#order_quantity');

const customer_name = $('#custName');
const qty_on_hand = $('#qtyOnHand');
const description = $('#desc');
const unit_price = $('#unit_price');
const net_total = $('.net_total span:nth-child(2)');
const sub_total = $('.sub_total span:nth-child(2)');
const discount = $('#discount');
const cash = $('#cash');
const balance = $('#balance');

const cart_btn = $('.cart_btn');
const order_btn = $('.order_btn');

let cart = [];

//set customer Ids
export function setCustomerIds(data) {
    customer_id.empty();
    customer_id.append('<option selected>select the customer</option>');

    data.map((customer) => {
        customer_id.append(
            `<option>${customer.customerId}</option>`
        )
    });
}

//set customer details
customer_id.on('input', () => {
    if (customer_id.val() !== 'select the customer'){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/customer',
            success: function (data) {
                data.map((customer) => {
                    if(customer_id.val() === customer.customerId){
                        customer_name.val(customer.name);
                    }
                })
            },
            error: function (err) {
                Swal.fire('Something went wrong', '', 'info')
            }
        });
    }else{
        customer_name.val('');
    }
});

//set date
const formattedDate = new Date().toISOString().substr(0, 10);
date.val(formattedDate);

//set item Ids
export function setItemIds(data) {
    item_Id.empty();
    item_Id.append('<option selected>select the item</option>');

    data.map((item) => {
        item_Id.append(
            `<option>${item.itemId}</option>`
        )
    });
}

//set item details
item_Id.on('input', () => {
    if (item_Id.val() !== 'select the item'){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/item',
            success: function (data) {
                data.map((item) => {
                    if(item_Id.val() === item.itemId){
                        description.val(item.description);
                        unit_price.val(item.unitPrice);
                        qty_on_hand.val(item.qty);
                    }
                })
            },
            error: function (err) {
                Swal.fire('Something went wrong', '', 'info')
            }
        });
    }else{
        description.val('');
        unit_price.val('');
        qty_on_hand.val('');
    }
});

//add to cart
cart_btn.on('click', () => {
    let itemId = item_Id.val();
    let orderQTY = parseInt(order_qty.val());
    let unitPrice = unit_price.val();
    let qty = qty_on_hand.val();

    if (validate(itemId, 'item id') && validate(orderQTY, 'order qty')) {

        let total = unitPrice * orderQTY;

        if (qty >= orderQTY) {
            let cartItemIndex = cart.findIndex(cartItem => cartItem.itemId === itemId);
            if (cartItemIndex < 0) {
                let cart_item = {
                    itemId: itemId,
                    unitPrice: unitPrice,
                    qty: orderQTY,
                    total: total
                }
                cart.push(cart_item);
                loadCart();
                setTotalValues()
                clearItemSection();
            } else {
                cart[cartItemIndex].qty += orderQTY;
                cart[cartItemIndex].total = cart[cartItemIndex].qty * cart[cartItemIndex].unitPrice;
                loadCart();
                setTotalValues()
                clearItemSection();
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'not enough quantity available 😔',
            });
        }
    }
});

//place order
order_btn.on('click', () => {
    let orderId = order_id.val();
    let order_date = date.val();
    let customerId = customer_id.val();
    let subTotal = parseFloat(sub_total.text());
    let cashAmount = parseFloat(cash.val());
    let discountValue = parseInt(discount.val()) || 0;
    let order_details = [];

    if (validate(orderId, 'order id') && validate(order_date, 'order date') &&
        validate(customerId, 'customer id')) {
        if (cashAmount >= subTotal) {
            if (cart.length !== 0) {
                Swal.fire({
                    title: 'Do you want to save the changes?',
                    showDenyButton: true,
                    confirmButtonText: 'Save',
                    denyButtonText: `Don't save`,
                }).then((result) => {
                    if (result.isConfirmed) {

                        let order = new OrderModel(orderId, order_date, discountValue, subTotal, customerId);

                        cart.forEach((cart_item) => {
                            let order_detail = new OrderDetailModel(orderId, cart_item.itemId, cart_item.qty);
                            order_details.push(order_detail);
                        });

                        //save order
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8080/order',
                            contentType: 'application/json',
                            data: JSON.stringify(order),
                            success: function (res) {

                                //save order details
                                $.ajax({
                                    type: 'POST',
                                    url: 'http://localhost:8080/orderDetails',
                                    contentType: 'application/json',
                                    data: JSON.stringify(order_details),
                                    success: function (res) {
                                        cart.splice(0, cart.length);
                                        loadCart();
                                        clearItemSection();
                                        loadItemTable();
                                        customer_id.val('select the customer');
                                        customer_name.val('');
                                        discount.val('');
                                        cash.val('');
                                        balance.val('');
                                        net_total.text('0/=');
                                        sub_total.text('0/=');
                                        loadOrderTable();
                                        Swal.fire('Order Placed! 🥳', '', 'success');
                                    },
                                    error: function (err) {
                                        Swal.fire('Changes are not saved', '', 'info')
                                    }
                                });

                            },
                            error: function (err) {
                                Swal.fire('Changes are not saved', '', 'info')
                            }
                        });

                        // setCounts();
                        // loadOrderTable();

                    } else if (result.isDenied) {
                        Swal.fire('Order is not saved', '', 'info');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Please add items to cart 😔',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Payment not settled 🤨',
            });
        }
    }
});

//set cart remove button
$('tbody').on('click', '.cart_remove', function() {
    const itemId = $(this).data('id');
    const index = cart.findIndex(cartItem => cartItem.itemId === itemId);
    Swal.fire({
        title: `Are you sure to remove ${itemId} from cart ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (index !== -1) {
                cart.splice(index, 1);
                loadCart();
                setTotalValues();
            }
            Swal.fire('Deleted!', '', 'success');
        }
    });
});

//set sub total value
discount.on('input', () => {
    let discountValue = parseFloat(discount.val()) || 0;
    if (discountValue < 0 || discountValue > 100) {
        discountValue = Math.min(100, Math.max(0, discountValue));
        discount.val(discountValue);
    }

    let total_value = calculateTotal();
    let discountAmount = (total_value * discountValue) / 100;
    sub_total.text(`${total_value - discountAmount}/=`);
    setBalance();
});

//set balance
function setBalance(){
    let subTotal = parseFloat(sub_total.text());
    let cashAmount = parseFloat(cash.val());
    balance.val(cashAmount - subTotal);
}

cash.on('input', () => setBalance());

function loadCart() {
    $('tbody').eq(2).empty();
    cart.map((item) => {
        $('tbody').eq(2).append(
            `<tr>
                <th scope="row">${item.itemId}</th>
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
                <td><button class="cart_remove" data-id="${item.itemId}">Remove</button></td>
            </tr>`
        );
    });
}

function calculateTotal(){
    let netTotal = 0;
    cart.map((cart_item) => {
        netTotal += cart_item.total;
    });
    return netTotal;
}

function setTotalValues(){
    let netTotal = calculateTotal();
    net_total.text(`${netTotal}/=`);

    let discount_percentage = discount.val() || 0;
    let discountAmount = (netTotal * discount_percentage) / 100;
    sub_total.text(`${netTotal - discountAmount}/=`);
}

function clearItemSection() {
    item_Id.val('select the item');
    description.val('');
    qty_on_hand.val('');
    unit_price.val('');
    order_qty.val('');
}

function validate(value, field_name){
    if (field_name === 'item id'){
        if (value === 'select the item'){
            Swal.fire({
                icon: 'warning',
                title: `Please select an item!`
            });
            return false;
        }
    }else if (field_name === 'customer id'){
        if (value === 'select the customer'){
            Swal.fire({
                icon: 'warning',
                title: `Please select a customer!`
            });
            return false;
        }
    }else if (!value){
        Swal.fire({
            icon: 'warning',
            title: `Please enter the ${field_name}!`
        });
        return false;
    }
    return true;
}

