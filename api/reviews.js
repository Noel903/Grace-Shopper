const express = require('express');
const reviewsRouter = express.Router();
const { 
    createReview,
    getReviewById,
    getReviewsByUser,
    getReviewsByProduct,
    deleteReview
} = require('../db');
const { requireUser } = require('./middleware');

// POST review
reviewsRouter.post('/', requireUser, async (req, res, next) =>{
    try{
        const review = await createReview(req.body);
        res.send(review);
    }catch(error){
        next(error);
    }
});

// GET review by id
reviewsRouter.get('/:reviewId', async (req, res, next) => {
    try {
        const review = await getReviewById(req.params.reviewId);
        res.send(review);
    } catch (error) {
        next(error)
    }
});

// GET reviews by user
reviewsRouter.get('/user/:userId', requireUser, async (req, res, next) => {
    try {
        const reviews = await getReviewsByUser(req.params.category);
        res.send(reviews);
    } catch (error) {
        next(error)
    }
});

// GET reviews by product
reviewsRouter.get('/product/:productId', async (req, res, next) => {
    try {
        const reviews = await getReviewsByProduct(req.params.productId);
        res.send(reviews);
    } catch (error) {
        next(error)
    }
});

// DELETE review
reviewsRouter.delete('/:reviewId', requireUser, async (req, res, next) => {
    
    const {reviewId} = req.params
    const id = reviewId
    
    try {
        const deletedReview = await getReviewById(id);
        
        if(deletedReview.creatorId === req.user.id) {
            await deleteReview(id)
        }

        res.send(deletedReview);
    } catch (error) {
        next(error)
    }
});

module.exports = reviewsRouter;