import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: "#D29F06"
    },
    toolBar: {
        display: "flex",
        justifyContent: "center",
        fontFamily: ['Berkshire Swash', "cursive"],
        color: "black"
    },
    button: {
        margin: "0 10px",
        backgroundColor :"#82400F"
    },
    link: {
        textDecoration: "none",
        color: "inherit",
    },
    title: {
        backgroundColor: "black",
        borderRadius: "5px",
        width: "250px",
        padding: "5px",
        textAlign: "center"
    },
    slogan: {
        padding: "3px",
        backgroundColor: "black",
        borderRadius: "5px",
        width: "150px",
        margin: "5px"
    }
}))

const Header = ({ isLoggedIn, userData, setToken, setUserData, setCart}) => {

    console.log('userData.isAdmin: ', userData.isAdmin);

    const onLogOutClick = async () => {
        localStorage.removeItem('capstone-token');
        setToken('');
        setUserData({});
        isLoggedIn = false;
        setCart([]);
    };

    const classes = useStyles();

    return (
        <>
            <div id="top">
                <h1 className={classes.title}>The Coffee Mug</h1>
                <p className={classes.slogan}>For All Things Coffee</p>
            </div>

            <AppBar className={classes.appBar} position="static">
                <Toolbar className={classes.toolBar} >
                    <p style={{margin:"10px"}}> 
                        <b id="hello">{ isLoggedIn ? (`Hello, ${userData.username}`) : null} 
                        </b> 
                    </p>

                    <Button variant="contained" className={classes.button}>
                        <Link className={classes.link} to="/products">Products</Link>
                    </Button>
                    
                    <Button variant="contained" className={classes.button}>
                        <Link className={classes.link} to="/cart">Cart</Link>
                    </Button>

                    <div>
                    { isLoggedIn 
                                ?
                                <>       
                                    {
                                        userData.isAdmin
                                        ?
                                        <Button variant="contained" 
                                            className= { classes.button }
                                            id="admin">
                                            <Link className={classes.link} to='/AdminEdit'>Admin</Link>
                                        </Button>
                                        :
                                        null
                                    }

                                    <Button variant="contained" 
                                            className= { classes.button }
                                            id="profile">
                                            <Link className={classes.link} to='/profile'>My Profile</Link>
                                    </Button>
                                    <Button variant="contained" 
                                            className= { classes.button }
                                            id="logout"
                                            onClick = {onLogOutClick}>
                                         <Link className={classes.link} to='/products'>Log Out</Link>
                                    </Button>

                                </>
                                : 
                                <>  
                                    <Button variant="contained" 
                                            className= { classes.button }
                                            id="login">
                                        <Link className={classes.link} to='/login'>Login</Link>
                                    </Button>
                                </>
                    }
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Header
