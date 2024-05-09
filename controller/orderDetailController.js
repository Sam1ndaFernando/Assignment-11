import { item_db, order_db, order_details_db } from "../db/db.js";
import { setOrderCount } from "./indexController.js"

const order_id = $('#order_detail_id');
const customer_id = $('#order_detail_customer_id');
const date = $('#order_details_date');
const discount = $('#order_details_discount');
const order_search = $('#order_detail_search input');
const order_search_option = $('#order_detail_search select');


// order_id.on('input', loadOrderDetails);

$('tbody').eq(3).on('click', 'tr', function () {
    let orderId = $(this).find('th').eq(0).text();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/order',
        success: function (data) {
            data.forEach((order) => {
                if (orderId === order.orderId) {
                    order_id.val(order.orderId);
                    customer_id.val(order.customerId);
                    date.val(order.date);
                    discount.val(order.discount);
                    loadOrderDetails(order)
                }
            })

        },
        error: function (err) {
            Swal.fire('Something went wrong', '', 'info')
        }
    });

    // loadOrderDetails();
});

//search order
// order_search.on('input', function (){
//     let option = order_search_option.find(":selected").text();
//     let searchTerm = order_search.val().trim().toLowerCase();
//     let matchingOrders = order_db.filter(order => order[option].toLowerCase() === searchTerm);

//     if (matchingOrders.length > 0) {
//         $('tbody').eq(3).empty();
//         matchingOrders.forEach(order => {
//             $('tbody').eq(3).append(
//                 `<tr>
//                 <th scope="row">${order.orderId}</th>
//                 <td>${order.customerId}</td>
//                 <td>${order.date}</td>
//              </tr>`
//             );
//         });
//     }else{
//         loadOrderTable();
//     }
// });

function loadOrderDetails(order) {

    console.log(order)
    $('tbody').eq(4).empty();

    let orderId = order.orderId;
    const order_detail = {orderId:orderId}

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/orderDetails',
        contentType: 'application/json',
        data: JSON.stringify(order_detail),
        success: function (data) {
            data.forEach((orderDetail) => {
                // let total = item.unitPrice * order_details_db[i].qty; // TODO

                // $.ajax({
                //     type: 'GET',
                //     url: 'http://localhost:8080/item',
                //     success: function (data) {
                //         data.forEach((item) => {
                //             if (item.itemId === orderDetail.itemId) {
                //                 // let total = item.unitPrice * order_details_db[i].qty; // TODO

                //                 $('tbody').eq(4).append(
                //                     `<tr>
                //                         <th scope="row">${item.itemId}</th>
                //                         <td>${item.description}</td>
                //                         <td>${item.unitPrice}</td>
                //                         <td>${item.qty}</td>
                //                         <td>${item.qty}</td>
                //                     </tr>`
                //                 );
                //             }
                //         })

                //     },
                //     error: function (err) {
                //         Swal.fire('Something went wrong', '', 'info')
                //     }
                // });

            })

        },
        error: function (err) {
            Swal.fire('Something went wrong', '', 'info')
        }
    });


}

export function loadOrderTable() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/order',
        success: function (data) {
            $('tbody').eq(3).empty();
            data.forEach(order => {
                $('tbody').eq(3).append(
                    `<tr>
                        <th scope="row">${order.orderId}</th>
                        <td>${order.customerId}</td>
                        <td>${order.date}</td>
                        <td>Rs. ${order.total}</td>
                     </tr>`
                )
            });
            setOrderCount(data.length);
        },
        error: function (err) {
            Swal.fire('Something went wrong', '', 'info')
        }
    });
}

loadOrderTable();
