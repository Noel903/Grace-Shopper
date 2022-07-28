import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, TextField, Snackbar, IconButton } from '@material-ui/core';
import { Link } from "react-router-dom";
import { CartItem } from './';
import CloseIcon from '@material-ui/icons/Close';
import { deleteUsersCart, getUsersCart, submitCheckout, fetchAllUserCheckoutsbyUserId, submitGuestCheckout } from '../api';

const useStyles = makeStyles(theme => ({
    cart: {
        width: "60vw",
        margin: "20px auto"
    },
    cartHeader: {
        textAlign: "center",
        margin: "20px 0",
        "& > button":{
            width: "200px",
            margin: "5px 0"
        },
        "& > h1":{
            fontSize: "3em"
        }
    },
    form: {
        padding: "10px",
        margin: "20px auto",
        borderRadius: "10px",
        backgroundColor: "#D29F06",
        maxWidth: "40vw",
        minHeight: "40vh",
        textAlign: "center",
        border: "4px solid black",
        color: "black" ,
        fontFamily: ['Berkshire Swash', "cursive"],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *":{
            margin: "5px 0"
        }
    },
    input: {
        width: "250px",
        color:"black"
    },
    button: {
        color: "black",
        width: "200px",
        backgroundColor :"#82400F"
    },
    noProducts: {
        textAlign: "center",
        "& > button":{
            width: "200px",
            marginTop: "10px",
            color: "black",
            backgroundColor :"#82400F"
        }
    },
    link: {
        textDecoration: "none",
        color: "inherit",
    },
    snackbar: {
        backgroundColor: "#4CAF50"
    }
}))

const Cart = ({userData, cart, setCart, setCheckouts, token, totalCartCost, setTotalCartCost}) => {

    const classes = useStyles();

    // Notifications
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState('');

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')
    const [phone, setPhone] = useState('')
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [creditCardExp, setCreditCardExp] = useState('');
    const [creditValidationNumber, setCreditValidationNumber] = useState('');

    const clearCart = async () => {
        // If logged in
        if(userData.id){
            const deletedCart = await deleteUsersCart(userData.id, token);
            const usersCart = await getUsersCart(userData.id, token);
            setCart(usersCart);
        // If logged out
        }else{
            const localCart = localStorage.setItem('capstone-cart', JSON.stringify([]));
            setCart([]);
        }

        setTotalCartCost(0);
    }

    const submitOrder = async (event) => {
        event.preventDefault();

        // If logged in
        if(userData.id){
            const checkout = await submitCheckout(
                {
                userId: userData.id,
                firstName, 
                lastName,  
                street, 
                city, 
                state, 
                zip, 
                phone,
                creditCardNumber,
                creditCardExp,
                creditValidationNumber,
                orders: cart
                },
                token
            );

            const usersCart = await getUsersCart(userData.id, token);
            setCart(usersCart);
            const usersCheckouts = await fetchAllUserCheckoutsbyUserId(userData.id, token);
            setCheckouts(usersCheckouts);

            setSuccess(`Your purchase was succesful.`)
            handleClick();
            
        // If logged out
        }else{

            const checkout = await submitGuestCheckout(
                {
                firstName, 
                lastName,  
                street, 
                city, 
                state, 
                zip, 
                phone,
                creditCardNumber,
                creditCardExp,
                creditValidationNumber,
                orders: cart
                },
                token
            );

            const localCart = localStorage.setItem('capstone-cart', JSON.stringify([]));
            setCart([]);
           
            setSuccess(`Your purchase was succesful.`)
            handleClick();
        }

        setTotalCartCost(0);
    }

    return (
        <div className={classes.cart}>
            {
            cart.length > 0 
            ?
            <>
                <div className={classes.cartHeader}>
                    <h1>{userData.id ? userData.username+"'s" : 'Your '} Cart</h1>
                    <Button variant="contained" onClick={() => {clearCart()}}>Clear Cart</Button>
                </div>
                {cart?.map((cartItem, index) => {
                    return (
                    <CartItem 
                    key={cartItem.productId}
                    totalCartCost={totalCartCost} 
                    setTotalCartCost={setTotalCartCost}
                    cartItem={cartItem} 
                    setCart={setCart}
                    userData={userData}
                    token={token}
                    />
                    );
                })} 

                <h2>Total Order Cost: {totalCartCost}</h2>

                <form className={classes.form} onSubmit={submitOrder}>
                    <h4 id="checkoutInstruction">Please Enter Your Shipping and Payment Information</h4>
                    <div id="creditCardSection">
                        <TextField 
                            className={classes.input}
                            type="text"
                            placeholder="First"
                            required
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}/>
                    <TextField
                            className={classes.input}
                            type="text"
                            placeholder="Last"
                            required
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}/>
                    </div>
                    <div id="creditCardSection">
                    <TextField
                            className={classes.input}
                            type="text"
                            placeholder="street"
                            required
                            value={street}
                            onChange={(event) => setStreet(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="City"
                            required
                            value={city}
                            onChange={(event) => setCity(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="State"
                            required
                            value={state}
                            onChange={(event) => setState(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="zip"
                            required
                            value={zip}
                            onChange={(event) => setZip(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="Phone"
                            required
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}/>
                        </div>
                        <div id="creditCardSection">
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="CC Number"
                            required
                            value={creditCardNumber}
                            onChange={(event) => setCreditCardNumber(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="Expiration"
                            required
                            value={creditCardExp}
                            onChange={(event) => setCreditCardExp(event.target.value)}/>
                        <TextField
                            className={classes.input}
                            type="text"
                            placeholder="CVV# on Back"
                            required
                            value={creditValidationNumber}
                            onChange={(event) => setCreditValidationNumber(event.target.value)}/>
                    </div>
                        <Box mx={1} my={1}>
                            <Button id="paymentSubmit"
                                    type="submit"  
                                    variant="contained" 
                                    className= { classes.button } 
                                    style={{ textDecoration: 'none' , color:'black'}} >
                                Submit Order
                            </Button>
                        </Box>
                </form>
            </>
            :
            <div className={classes.noProducts}>
                <h2>You have no items in your cart. Start shopping to get some!!</h2>
                <Button variant="contained"
                id="login">
                    <Link className={classes.link} to='/products'>Products</Link>
                </Button>
            </div>
            }
            <Snackbar
                ContentProps={{
                    classes: {
                        root: classes.snackbar
                    }
                }}
                className={classes.snackbar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
                action={
                <>
                    {success}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />
        </div>
    );
};

export default Cart;
