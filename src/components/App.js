import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, Redirect } from "react-router-dom";
import { UserForm, Cart, Header, Products, Product, AdminEdit, UserProfile } from './';
import { getUser, getAllProducts, getUsersCart, fetchAllUserCheckoutsbyUserId } from '../api';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    noPageHeader: {
        marginTop: "20px",
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
    }

}))

//START OF COMPONENT
const App = () => {

    const classes = useStyles();

    const [token, setToken] = useState('');
    const [userData, setUserData] = useState({});

    const [totalCartCost, setTotalCartCost] = useState(0);

    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([]);
    const [checkouts,setCheckouts] = useState([])
    const [cart, setCart] = useState([]);

    const getTotal = (usersCart) => {
        let newTotal = 0;
    
        usersCart.forEach((cartItem) => {

            let avalibleQuantity = cartItem.inventoryQuantity;
            if(avalibleQuantity > 100){
                avalibleQuantity = 100;
            }

            let purchaseQuantity = cartItem.orderQuantity;
            if(purchaseQuantity > avalibleQuantity){
                purchaseQuantity = avalibleQuantity;
            }
            newTotal += cartItem.price * purchaseQuantity;
        });

        setTotalCartCost(newTotal);
    }

    // token / userData
    useEffect(async () => {
        if (!token) {
            setToken(localStorage.getItem('capstone-token'));
            return;
        }
        const data = await getUser(token);
        setUserData(data);
    }, [token]);

    // products
    useEffect(async () => {
        const response = await getAllProducts();
        setProducts(response)
    }, []);

    //checkout
    useEffect(async () => {
        if(userData.id !== undefined){
            const usersCheckouts = await fetchAllUserCheckoutsbyUserId(userData.id, token);
            setCheckouts(usersCheckouts);
        }
    }, [userData]);

    // cart
    useEffect(async () => {
        setCart([]);
        if(userData.id !== undefined){
            const usersCart = await getUsersCart(userData.id, token);
            if(typeof usersCart === 'object'){
                setCart(usersCart);
                getTotal(usersCart);
            }
        } else {
            let localCart = JSON.parse(localStorage.getItem('capstone-cart'));
            if(!localCart){
                localCart = [];
                localStorage.setItem('capstone-cart', JSON.stringify(localCart));
            }
            setCart(localCart);
            getTotal(localCart);
        }
    }, [userData]);

   const isLoggedIn = (userData.username !== undefined);

    return (
        <>
            <Header isLoggedIn={isLoggedIn} userData={userData} setToken={setToken} setUserData={setUserData} setCart={setCart}/>

            <Switch>

                <Route exact path='/register'>
                    <UserForm action='register' setToken={setToken} setUserData={setUserData}/>
                </Route> 

                <Route exact path='/login'>
                    <UserForm action='login' setToken={setToken} setUserData={setUserData}/>
                </Route>

                <Route exact path='/cart'>
                    <Cart userData={userData} cart={cart} setCart={setCart} setCheckouts={setCheckouts} token={token} totalCartCost={totalCartCost} setTotalCartCost={setTotalCartCost}/>
                </Route>  

                <Route exact path='/AdminEdit'>
                    <AdminEdit  products={products} token={token}/>
                </Route> 
                
                <Route exact path='/products'>
                    <Products products={products} />
                </Route> 

                <Route exact path='/products/:productId'>
                    <Product token= {token} products={products} setCart={setCart} isLoggedIn={isLoggedIn} userData={userData} totalCartCost={totalCartCost} setTotalCartCost={setTotalCartCost}/>
                </Route>

                <Route exact path='/profile'>
                    <UserProfile token= {token} userData={userData} setUserData={setUserData} checkouts={checkouts} />
                </Route>

                {/* 404 */}
                <Route exact path='/404'>
                    <div className={classes.noPageHeader}>
                        <h2>404 - This page does not exist</h2>
                        <Button variant="contained" 
                                id="backtoproducts">
                            <Link className={classes.link} to='/products'>Back To Products</Link>
                        </Button>
                    </div>
                </Route>

                <Redirect exact from="/" to="/products"></Redirect>
                <Redirect from="/" to="/404"></Redirect>

            </Switch>
        </>
  );

}

export default App;
