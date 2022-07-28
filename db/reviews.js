const { client }= require('./client');

async function createReview({productId, userId, message}) {
    try {
        const {rows: [review]} = await client.query(`
        INSERT INTO reviews("productId", "userId", message) 
        VALUES ($1, $2, $3)
        RETURNING *;
        `, [productId, userId, message]);
      return review;
    } catch (error) {
        throw error;
    }
}

async function getReviewById(id) {
    try {
        const {rows: [review]} = await client.query(`
        SELECT *
        FROM reviews
        WHERE id = $1;
        `, [id]);
        return review;  
    } catch (error) {
        throw error;
    }
}

async function getReviewsByUser(id) {
    try {
        const {rows: reviews} = await client.query(`
        SELECT *
        FROM reviews
        WHERE "userId" = $1;
        `, [id]);
        return reviews;  
    } catch (error) {
        throw error;
    }
}

async function getReviewsByProduct(id) {
    try {
        const {rows: reviews} = await client.query(`
        SELECT *
        FROM reviews
        JOIN users ON reviews."userId" = users.id
        WHERE "productId" = $1;
        `, [id]);
        return reviews;  
    } catch (error) {
        throw error;
    }
}

async function deleteReview(id) {
    try {
        const { rows: [ review ] } = await client.query(`
        DELETE FROM reviews
        WHERE id=$1
        RETURNING *;
        `, [id]);
        return review;  
    } catch (error) {
        throw error;
    }
}
  
module.exports = {
    createReview,
    getReviewById,
    getReviewsByUser,
    getReviewsByProduct,
    deleteReview
}