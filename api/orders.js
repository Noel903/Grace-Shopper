const express = require('express');
const ordersRouter = express.Router();
const {
    createOrder,
    getAllOrdersByUserId,
    getOrderById,
    getUsersCart,
    deleteOrder,
    updateOrderQuantity,
    deleteUsersCart
} = require('../db');
const { requireUser } = require('./middleware');

// GET /:userId
ordersRouter.get('/:userId', requireUser, async (req, res, next) => {
    try{
        const orders = await getAllOrdersByUserId(req.params.userId);
        res.send(orders);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// GET /:userId/profile
ordersRouter.get('/:userId/profile', requireUser, async (req, res, next) => {
    try{
        const orders = await getAllOrdersByUser(req.params.userId);
        res.send(orders);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// POST /
ordersRouter.post('/', async (req, res, next) => {
    try{
        const order = await createOrder(req.body);
        res.send(order);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// PATCH /:orderId
ordersRouter.patch('/:orderId', requireUser, async (req, res, next) => {     
    try{
        const order = await updateOrderQuantity({id: req.params.orderId, quantity: req.body.quantity});
        res.send(order);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// GET /:orderId
ordersRouter.get('/:orderId', requireUser, async (req, res, next) => {
    try{
        const orders = await getOrderById(req.params.orderId);
        res.send(orders);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// GET /cart/:userId
ordersRouter.get('/cart/:userId', requireUser, async (req, res, next) => {
    try{
        const cart = await getUsersCart(req.params.userId);
        res.send(cart);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// DELETE cart/:userId
ordersRouter.delete('/cart/:userId', requireUser, async (req, res, next) => {
    try{
        const cart = await deleteUsersCart(req.params.userId);
        res.send(cart);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

// DELETE /:orderId
ordersRouter.delete('/:orderId', requireUser, async (req, res, next) => {
    try{
        const order = await deleteOrder(req.params.orderId);
        res.send(order);
    }
    catch ({name, message}) {
        next({name, message});
    };
});

module.exports = ordersRouter;