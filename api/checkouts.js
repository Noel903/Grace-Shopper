const express = require('express');
const checkoutsRouter = express.Router();

const {  getAllUserCheckouts, createCheckout } = require('../db');
const { requireUser } = require('./middleware');


// GET All User Checkouts
checkoutsRouter.get('/:userId', requireUser, 
async (req, res, next) => {
    
    try{
        const checkout = await getAllUserCheckouts(req.params.userId);
        res.send(
            checkout
        );
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// POST a new Checkout
checkoutsRouter.post('/', requireUser, async (req, res, next) => {

    try{
        const checkout = await createCheckout(req.body);
        res.send(checkout);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// POST a new Checkout
checkoutsRouter.post('/guest', async (req, res, next) => {

    try{
        const checkout = await createCheckout({userId: undefined, ...req.body});
        res.send(checkout);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

module.exports = checkoutsRouter;