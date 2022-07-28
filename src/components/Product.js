import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { callApi, getReviewsByProduct, createOrder, getUsersCart } from '../api';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    button: {
        color: "black",
        width: "200px",
        backgroundColor :"#82400F"
    },
    snackbar: {
        backgroundColor: "#4CAF50"
    }
}))

const Product = ({ products, token, setCart, isLoggedIn, userData, totalCartCost, setTotalCartCost }) => {
    
    if(products.length === 0){
        return null
    } 

    const classes = useStyles();

    // Notification states
    const [cartOpen, setCartOpen] = useState(false);
    const [cartSuccess, setCartSuccess] = useState('');
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState('');

    // Component states
    const { productId } = useParams();
    const [addReview, setAddReview] = useState(false)
    const [reviews, setReviews ] = useState([]);
    const [message, setMessage] = useState('');

    // Notification funcs
    const handleCartClick = () => {
        setCartOpen(true);
    };

    const handleCartClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setCartOpen(false);
    };

    const handleReviewClick = () => {
        setReviewOpen(true);
    };

    const handleReviewClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setReviewOpen(false);
    };

    // Component funcs
    const addThisReview = async(event) => {
        event.preventDefault()

        await callApi({
            url: `/reviews`,
            body: { 
                productId, 
                userId: userData.id, 
                message 
            },
            method: 'POST',
            token,
        })

        const updatedReviews = await getReviewsByProduct(productId);
        setReviews(updatedReviews)

        setReviewSuccess(`Review added`)
        handleReviewClick();
    }

    const addToCart = async () => {

        if(userData.id){
            const order = await createOrder({
                userId: userData.id,
                purchaseComplete: false,
                productId: product.id,
                quantity: 1,
                token
            });
            const usersCart = await getUsersCart(userData.id, token);
            setCart(usersCart);

            setCartSuccess(`${product.title} added to cart`)
            handleCartClick();

            setTotalCartCost(totalCartCost + product.price);

        } else {
            const localCart = JSON.parse(localStorage.getItem('capstone-cart'));
            const order = {
                userId: 'guest',
                purchaseComplete: false,
                orderQuantity: 1,
                productId: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
                inventoryQuantity: product.inventoryQuantity

            };
            
            localCart.push(order);
            localStorage.setItem('capstone-cart', JSON.stringify(localCart));
            setCart(localCart);

            setCartSuccess(`${product.title} added to cart`)
            handleCartClick();

            setTotalCartCost(totalCartCost + product.price);
        }
    }

    useEffect(async () => {
        const response = await getReviewsByProduct(productId);
        setReviews(response)
    }, []);

    const product = products.find((product) => productId == product.id);
    if(product === undefined){
        return null
    }
    
    return (
        <div className="container">
            <div className="image-div">
                <Button className= {classes.button} >
                    <Link to="/products">Back to All Products</Link>
                </Button>
                <br></br>
                <img style={{ maxWidth:"150px", height: "auto"}} src={product.image}></img>
            </div>
            <div id="product">
            <h3 id="product-title">{product.title}</h3>
            <br></br>
            <div id="text">{product.description}</div>
            <br></br>
            <div id="price-div">
                <div id="text">${product.price}</div>
                <div id="add-to-cart">
                    <Button className= {classes.button} variant="contained" onClick={() => {addToCart()}}>Add to Cart</Button>
                </div>
            </div>
            <br></br>
            <div id="review-div">
            <h3 id="review-title">Reviews</h3>
            {isLoggedIn?(<div>
                <Button className= {classes.button} variant="contained" onClick={() => addReview ? setAddReview(false) : setAddReview(true)}>Write A Review</Button>
                {
                addReview 
                ? 
                <div id="review-form-div">
                    <form id="review-form" onSubmit={addThisReview}>
                        <div>
                            <input
                                type="text"
                                placeholder="add a review"
                                required
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                            >
                            </input>
                        </div>
                        <Button className= {classes.button} type="submit"> Submit Your Review </Button>
                    </form>
                </div>
                : 
                null
                }
            </div>):null}
            </div>
            <br></br>
            {reviews.length > 0 ? reviews?.map((review,index) => (
                <div value ={review.id} key={index}>
                    <div id="text">{review.message} - <em>{review.username}</em></div>
                </div> )): 
                <div> There are no reviews!</div>
            }
            
            </div>
            {/* Cart */}
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
                open={cartOpen}
                onClose={handleCartClose}
                action={
                <>
                    {cartSuccess}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCartClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />

            {/* Review */}
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
                open={reviewOpen}
                onClose={handleReviewClose}
                action={
                <>
                    {reviewSuccess}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleReviewClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />
        </div>
    )
}

export default Product;
