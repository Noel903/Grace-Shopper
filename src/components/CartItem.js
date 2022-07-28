import React, { useState, useEffect }  from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { deleteOrder, getUsersCart, updateOrderQuanity } from '../api';

const useStyles = makeStyles(theme => ({
    cartItem: {
        border:"1px solid lightgrey"
    },
    cartInfo: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        "& button":{
            width: "200px",
        }
    },
    image: {
        maxHeight: "200px",
        maxHeight: "200px",
    }
}))

const CartItem = ({cartItem, setCart, userData, token, totalCartCost, setTotalCartCost}) => {


    // const [orderQuantity, setOrderQuantity] = useState(0);
    // const [totalCost, setTotalCost] = useState(0);

    const classes = useStyles();

    let avalibleQuantity = cartItem.inventoryQuantity;
    if(avalibleQuantity > 100){
        avalibleQuantity = 100;
    }

    let purchaseQuantity = cartItem.orderQuantity;
    if(purchaseQuantity > avalibleQuantity){
        purchaseQuantity = avalibleQuantity;
    }


    const [orderQuantity, setOrderQuantity] = useState(purchaseQuantity);
    const [totalCost, setTotalCost] = useState(cartItem.price * purchaseQuantity);

    // setOrderQuantity(purchaseQuantity);
    // setTotalCost(cartItem.price * purchaseQuantity);

    console.log(orderQuantity, totalCost)
    const inventoryQuantity = [];
    for(let i = 1; i <= avalibleQuantity; i++){
        if(i === purchaseQuantity){
            inventoryQuantity.push(<option key={'Cart_Item_option_'+i} value={i} defaultValue>{i}</option>);
        }else{
            inventoryQuantity.push(<option key={'Cart_Item_option_'+i} value={i}>{i}</option>);
        }
    }

    const changeQuantity = async (quantity) => {

        let newTotalOrderCost = totalCartCost - totalCost;
        newTotalOrderCost += cartItem.price * quantity;
        setTotalCartCost(newTotalOrderCost);

        // If logged in
        if(userData.id){
            const data = await updateOrderQuanity(cartItem.orderId, quantity, token);
            setOrderQuantity(quantity)
            setTotalCost(cartItem.price * quantity);
        // If guest
        } else {

            const localCart = JSON.parse(localStorage.getItem('capstone-cart'));

            localCart.forEach((localCartItem) => {
                if(localCartItem.productId === cartItem.productId){
                    localCartItem.orderQuantity = quantity;
                }
            });

            localStorage.setItem('capstone-cart', JSON.stringify(localCart));
            setOrderQuantity(quantity)
            setTotalCost(cartItem.price * quantity);
        }
    }

    const removeItem = async () => {

        // If logged in
        if(userData.id){
            const data = await deleteOrder(cartItem.orderId, token);
            const usersCart = await getUsersCart(userData.id, token);
            setCart([]);
            setCart(usersCart);

            setTotalCartCost(totalCartCost - totalCost);
        // If guest
        }else{
            const localCart = JSON.parse(localStorage.getItem('capstone-cart'));

            const newLocalCart = localCart.filter((localCartItem) => {
                if(localCartItem.productId === cartItem.productId){
                    return false;
                }
                return true;
            });

            localStorage.setItem('capstone-cart', JSON.stringify(newLocalCart));
            setCart([]);
            setCart(newLocalCart);

            setTotalCartCost(totalCartCost - totalCost);
        }
    }

    return (
        <Grid className={classes.cartItem} container spacing={2}>
            <Grid item xs-="true">
                <div>
                    <img className={classes.image} src={cartItem.image}/>
                </div>
            </Grid>
            <Grid item xs className={classes.cartInfo}>
                <h2>{cartItem.title}</h2>
                <h3>Price: {cartItem.price}</h3>
                <h3>Quantity:
                <select 
                value={orderQuantity} 
                onChange={(event) => changeQuantity(event.target.value)}>
                {inventoryQuantity}
                </select>
                </h3>
                <h3>Total Cost: {totalCost}</h3>
                <Button variant="contained" color="secondary" onClick={() => {removeItem()}}>Remove From Cart</Button>
            </Grid>
        </Grid>
    );
};

export default CartItem;