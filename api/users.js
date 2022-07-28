const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser } = require('./middleware');

const { 
    createUser,
    editEmail, 
    getUserByUsername,
    getUserById, 
    getUser, 
    getAllCompletedOrdersByUserId,
    getAllCheckoutsByUserId
} = require('../db'); 

const { JWT_SECRET } = process.env;

// POST /api/users/login
userRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const user = await getUser({username, password});
    if(!user) {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      })
    } else {
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
      res.send({ user, username, message: "you're logged in!", token });
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/me
userRouter.patch('/me', requireUser, async (req, res, next) => {

   try {
    if (!req.body.email) {
      next({
        name: 'IncorrectEmailError',
        message: 'email  is shorter than 8 characters',
      })
    } else {
      const editedEmail = await editEmail({ email: req.body.email, userId: req.body.userId });
      res.send(editedEmail);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/register
userRouter.post('/register', async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      res.status(401);
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: 'PasswordLengthError',
        message: 'Password Too Short! Must be 8 characters or longer'
      });
    } else {
      const user = await createUser({
        username,
        email,
        password
      });
      if (!user) {
        next({
          name: 'UserCreationError',
          message: 'There was a problem registering you. Please try again.',
        });
      } else {
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, { expiresIn: '1w' });
        res.send({ user, message: "you're signed up!", token });
      }
    }
  } catch (error) {
    next(error)
  }
})

// GET /api/users/me
userRouter.get('/me',  async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error)
  }
})

// GET /api/users/:userId/orders
userRouter.get('/:userId/orders', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    if(!user) {
      next({
        name: 'NoUser',
        message: `Error looking up getUserById(id): ${userId}`
      });
    } else if(req.user && user.id === req.user.id) {
const orders = await getAllCompletedOrdersByUserId(userId);
      res.send(orders);
    }
  } catch (error) {
    next(error)
  }
})

// GET /api/users/:userId/checkouts
userRouter.get('/:userId/checkouts', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId);

    if(!user) {
      next({
        name: 'NoUser',
        message: `Error looking up user ${userId}`
    });
    } else if(req.user && user.id === req.user.id) {
      const checkouts = await getAllCheckoutsByUserId({userId});
      res.send(checkouts);
    } 
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter;