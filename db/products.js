const {client} = require('./client');

async function createProducts({title, description, price, inventoryQuantity, category, image, isActive}) {
    try {
        const { rows: [product] } = await client.query(`
        INSERT INTO products (title, description, price, "inventoryQuantity", category, image, "isActive")
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `, [title, description, price, inventoryQuantity, category, image, isActive])
        return product;
    } catch(error) {
        throw error;
    }
}

async function getAllProducts() {
    try {
        const { rows: products } = await client.query(`
        SELECT *
        FROM products
        `);
        return products;
    } catch(error) {
        throw error;
    }  
}

async function getProductsById(id) {
    try {
        const { rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id = $1
        `, [id])
        return product
    } catch(error) {
        throw error;
    }
}

async function getProductsByCategory(category) {
    try {
        const { rows: products} = await client.query(`
        SELECT *
        FROM products
        WHERE category = $1
        `, [category])
        return products
    } catch {

    }
}

async function updateProducts({title, price, inventoryQuantity, category, image, id}) {


    // decsription = $2, 
    console.log('in /DB updateProducts');
    console.log({title, price, inventoryQuantity, category, image, id});
    try {
        const { rows: products} = await client.query(`
            UPDATE products
            SET title = $1,  
            price= $2, 
            "inventoryQuantity" = $3, 
            category = $4, image = $5
            WHERE id = $6;
        `, [title, price, inventoryQuantity, category, image, id])
        return products
    } catch {

    }
}

module.exports = {
    createProducts,
    getAllProducts,
    getProductsById,
    getProductsByCategory,
    updateProducts
}
