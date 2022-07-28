const {client} = require('./client');

async function createCheckout({userId, firstName, lastName, street, city, state, zip, creditCardNumber, phone, creditCardExp, creditValidationNumber, orders}) {

    try {
        const { rows: [checkoutId] } = await client.query(`
        INSERT INTO checkouts (
        "userId","firstName", "lastName", street, city , 
        state, zip, phone, "creditCardNumber",
        "creditCardExp","creditValidationNumber"
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `, [ userId, firstName, lastName, street, city, state, zip, phone, creditCardNumber, creditCardExp, creditValidationNumber]);

        const updateOrders = async (order) => {
            try{
                const { rows: [updatedOrder] } = await client.query(`
                UPDATE orders
                SET "purchaseComplete"=true, "checkoutId"=$1, "unitPrice"=$2
                WHERE id=$3
                RETURNING id;
                `, [checkoutId.id, order.price, order.orderId]);
                return updatedOrder;
            }catch(error){
                throw error;
            }
        }

        const updatedOrders = await Promise.all(orders.map(updateOrders));
        return updatedOrders;

    } catch(error) {
        throw error;
    }
}

async function getAllCheckouts() {
    try {
        const { rows: checkouts } = await client.query(`
        SELECT *
        FROM checkouts
        `);
        return checkouts;
    } catch(error) {
        throw error;
    }  
}


async function getAllCheckoutsByUserId({userId}) {
        try {
            const { rows: checkouts } = await client.query(`
            SELECT *
            FROM checkouts
            WHERE "userId"= $1;
            `, [userId]);
       
            const getOrders = async ( checkout )=>{

                try{
                    const{rows: orders } = await client.query(`
                    SELECT orders.*,
                    products.title
                    FROM orders
                    JOIN products 
                    ON orders."productId" = products.id
                    WHERE orders."checkoutId"=$1;
                    `, [checkout.id]) ;
                    checkout.orders = orders;
                return checkout
                }catch(error){
                    throw (error)
                }
            }
            
            const returnedCheckout = await Promise.all(checkouts.map(getOrders));
  
            return returnedCheckout
        } catch(error) {
            throw error;
        }
    }


module.exports = {
    createCheckout,
    getAllCheckouts,
    getAllCheckoutsByUserId
}