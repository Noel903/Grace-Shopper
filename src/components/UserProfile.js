import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { updateEmail } from '../api';

const useStyles = makeStyles(theme => ({
    cart: {
        width: "60vw",
        margin: "20px auto"
    },
     form: {
        padding: "10px",
        margin: "10px auto",
        border: "black",
        borderRadius: "10px",
        backgroundColor: "#D29F06",
        maxWidth: "40vw",
        minHeight: "40vh",
        textAlign: "center",
        border: "4px solid black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *":{
            margin: "5px 0"
        }
    },
    input: {
        width: "250px"
    },
    button: {
        color: "black",
        width: "200px",
        backgroundColor :"#82400F"
    },
    link: {
        textDecoration: "none",
        color: "inherit",
    },
    snackbar: {
        backgroundColor: "#4CAF50"
    }
}))

const UserProfile = ({ token, userData, setUserData, checkouts}) => {
    const classes = useStyles();
    const [email, setEmail] = useState(userData.email);

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

    const editEmail = async (event) => {
        event.preventDefault();
        const data = await updateEmail({ token, userId: userData.id, email });
        setUserData(data)

        setSuccess(`Email changed to: ${email}`)
        handleClick();
    };

    return(
        <>
            <h2>Change User Information</h2>
            <div id="checkoutInfo">
                <div id="itempart">
                    <form onSubmit={editEmail}>
                        <div id="itempart">
                            <TextField 
                                className={classes.input}
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}/>
                        </div>
                        <div id="itempart">
                            <Button variant="contained" 
                                    className= { classes.button } 
                                    type="submit" 
                                    style={{ textDecoration: 'none' , color:'black'}}>
                                Edit Email
                            </Button>
                        </div>
                    </form>
                </div>
                </div>
                <h2>Order History</h2>
                <div id="orderHistory">
                    
                    <div id="purchase">
                    {checkouts?.map((checkout, index)=>{
                        return (
                        <div key={checkout.id} 
                            id="purchase">
                            <h3 id="itempart">Name: {checkout.firstName}, {checkout.lastName}</h3>
                            <p id="itempart"><b>Address:</b> {checkout.street}, {checkout.city}, {checkout.state} {checkout.zip}</p>
                            <p id="itempart"><b>Last 4# of Credit Card:</b>{checkout.creditCardNumber.substring(12)}  <b>Exp:</b>{checkout.creditCardExp}</p>
                            {checkout.orders?.map((orderItem, index) => {
                                return(
                                    <div key={orderItem.id}
                                        id="item">
                                        <h4 id="itempart">{orderItem.title}</h4>
                                        <br></br>
                                        <p id="itempart"><b>Quantity:</b>{orderItem.quantity}</p>
                                        <br></br>
                                        <p id="itempart"><b>Price:</b>{orderItem.unitPrice}</p>
                                    </div>
                                )  
                            }) }
                        </div>
                    )} )}
                </div>
            </div>

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
        </>
    )
};

export default UserProfile;
