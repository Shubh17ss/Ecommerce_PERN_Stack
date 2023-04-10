const pool = require('../database/connect');
const jwt = require('jsonwebtoken');



// Main Router functions

const createOrder = (req, res) => {

    const { token } = req.cookies;
    const user_id = jwt.decode(token, process.env.JWT_SECRET).id;
    const date = new Date();

    const { orderedItems, shipping_id, payment_method} = req.body;
    pool.query('INSERT INTO orders(user_id, status, created_at,address_id) VALUES($1, $2, $3, $4) RETURNING order_id', [user_id, "Processing", date, shipping_id], async (error, results) => {
        if (error)
            res.status(400).send(error.message);
        else {
            const order_id = results.rows[0].order_id;
            insertAndGetInfo(orderedItems, order_id, payment_method);
            updateStock(order_id);
            res.status(200).json({
                success:true,
                message:'Order Created Successfully'
            })
            
        }
    })

}

const getSingleOrder = async (req, res) => {
    const order_id = req.params.id;
    let flag = 0;
    let order_data;
    let shipping_data;
    let ordered_products;
    let payment_data;
    let ordered_by;

    const ret = new Promise((resolve, reject) => {
        pool.query('SELECT * FROM orders where order_id=$1', [order_id], (error, results) => {
            if (error)
                flag = 1;
            else {
                if (results.rows.length == 0)
                    reject();
                else
                    order_data = results.rows[0];
            }
        })

        pool.query('SELECT * FROM ordered_products where order_id=$1 ORDER BY product_id', [order_id], (error, results) => {
            if (error)
                flag = 1;
            else
                ordered_products = results.rows;
        })

        pool.query('SELECT * FROM payments where order_id=$1', [order_id], (error, results) => {
            if (error)
                flag = 1;
            else
                payment_data = results.rows[0];

        })

        pool.query('SELECT * FROM shipping where order_id=$1', [order_id], (error, results) => {
            if (error)
                flag = 1;
            else {
                shipping_data = results.rows[0];
            }

        })

        setTimeout(() => {
            pool.query('SELECT name, email from users where id=(select user_id from orders where order_id=$1)', [order_id], (error, results) => {
                if (error)
                    flag = 1;
                else {
                    console.log(results.rows[0]);
                    ordered_by = results.rows[0];
                    resolve();
                }
            })
        }, 1000)



    })

    ret.then(async () => {
        if (flag === 1)
            res.status(400).send('Internal Server Error');
        else {
            const products = { ordered_products };
            console.log(products);
            res.status(200).json({
                order_data,
                ordered_by,
                shipping_data,
                payment_data,
                products,
            })
        }
    }).catch(() => {
        res.status(404).send("Order Not found");
    })
}

const getMyOrders = (req, res) => {
    const { token } = req.cookies;
    const user_id = jwt.decode(token, process.env.JWT_SECRET).id;

    pool.query('SELECT *,payments.order_total FROM ORDERS INNER JOIN payments on orders.order_id=payments.order_id WHERE ORDERS.user_id = $1 ORDER BY orders.order_id DESC', [user_id], (error, results) => {
        if (error)
            res.status(400).send(error.message)
        else {
            if(results.rows.length===0){
                res.status(404).send('No orders found');
            }
            let orders = [];
            const ret = new Promise((resolve, reject) => {
                let counter = 0;
                let len = results.rows.length;
                results.rows.forEach(order => {
                    pool.query('SELECT product_id, quantity from ordered_products where order_id=$1', [order.order_id], (error, results) => {
                        if (error)
                            reject();
                        else {
                            counter++;
                            let order_total=order.order_total.toLocaleString();
                            let date=new Date(order.created_at);
                            date=date.toLocaleDateString('en-Gb');
                            results.rows.unshift({ order_id: order.order_id,total:order_total,order_date:date,status:order.status })
                            orders.push(results.rows);
                            if (counter === len)
                                resolve();
                        }

                    })
                })
            })

            ret.then(() => {
                orders = { orders };
                res.status(200).json({
                    success: true,
                    TotalOrders: results.rows.length,
                    orders,
                });
            }).catch(() => {
                res.status(400).send('Internal server error');
            })

        }
    })
}


//Admin specifig functions

const getAllOrders = (req, res) => {
    pool.query('SELECT * FROM ORDERS INNER JOIN payments ON payments.order_id=ORDERS.order_id ORDER BY ORDERS.order_id', (error, results) => {
        if (error)
            res.status(400).send(error.message);
        else {
            let total_orders_value = 0;
            results.rows.forEach(order => {
                total_orders_value += order.order_total;
            })
            let orders = results.rows;
            res.status(200).json({ total_orders_value, orders })
        }
    })
}

const updateOrderStatus = (req, res) => {
    const order_id = req.params.id;
    const status = req.body.status;
    const date = status === "Delivered" ? new Date() : null;
    pool.query('SELECT status from orders where order_id=$1', [order_id], (error, results) => {
        if (error)
            res.status(400).send(error.message);
        else {
            if (results.rows[0].status === "Delivered")
                res.status(404).send('Order Already Delivered');

            else {
                pool.query('UPDATE orders SET delivered_at=$1', [date], (error, results) => {
                    if (error) {
                        res.status(400).send(error.message);
                    }
                    else {
                        pool.query('UPDATE orders SET status=$1 where order_id=$2', [status, order_id], async (error, results) => {
                            if (error)
                                res.status(400).send(error.message);
                            else {
                                if (status === "Delivered")
                                    await updateStock(order_id);
                    
                                res.status(200).json({
                                    success: true,
                                    message: 'Order updated successfully'
                                })
                    
                            }
                        })
                    }
                })

            }
        }
    })


}

const deleteOrder = (req,res) =>{
    const order_id=req.params.id;
    pool.query('DELETE FROM ORDERS WHERE ORDER_ID = $1',[order_id],(error,results)=>{
        if(error)
        res.status(400).send(error.message);
        else
        res.status(200).json({
            success:true,
            message:'Order deleted successfully'
        })
    })
}


   

//Helper Functions

const insertAndGetInfo = (orderedItems, order_id ,payment_method) => {
    let cart_value = 0;
    let counter = 0;
    let ret = new Promise((resolve, reject) => {
        orderedItems.forEach((orderItem) => {

            pool.query('INSERT INTO ordered_products(order_id, product_id, quantity) VALUES($1,$2,$3)', [order_id, orderItem.id, orderItem.quantity], (error, results) => {
                if (error)
                    console.log(error.message);
            });
            pool.query('SELECT price FROM products where id=$1', [orderItem.id], (error, results) => {
                if (error)
                    console.log(error.message);
                else {
                    console.log(results.rows[0].price);
                    cart_value = cart_value + (results.rows[0].price * orderItem.quantity);
                    counter++;
                    if (counter === orderedItems.length)
                        resolve();
                }
            })

        })
    })
    ret.then(() => {
        const tax = 0;
        const shipping_price = 79;
        const order_total = cart_value + tax + shipping_price;
        pool.query('INSERT INTO PAYMENTS(order_id, payment_status, cart_value, tax, shipping_price, order_total, payment_mode) VALUES($1,$2,$3,$4,$5,$6,$7)', [order_id, "Pending", cart_value, tax, shipping_price, order_total, payment_method], (error, results) => {
            if (error)
                console.log(error.message);
            else
                console.log('Payment successfully registered');
        })
    })
}

const updateStock = (order_id) => {
    pool.query('SELECT product_id, quantity from ordered_products where order_id=$1', [order_id], (error, results) => {
        if (error)
            console.log(error.message);
        else {
            const products = results.rows;
            products.forEach(product => {
                pool.query('UPDATE products SET stock=(SELECT stock from products where id=$1)-$2 where id=$1', [product.product_id, product.quantity], (error, results) => {
                    if (error)
                        console.log(error.message);
                    else
                        console.log('Stock updated');
                })
            })
        }
    })
}


module.exports = {
    createOrder,
    getSingleOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
}