import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { callApi } from "../api";
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles( theme => ({
    form: {
        padding: "10px",
        margin: "10px auto",
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
        backgroundColor: "#F44335"
    }
}))

const UserForm = ({ action, setToken, setUserData }) => {

    const classes = useStyles();
    const history = useHistory();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isLogin = action === 'login';
    const title = isLogin ? 'Login' : 'Register';
    const oppositeAction = isLogin ? 'register' : 'login';
    const oppositeTitle = isLogin ? 'Register' : 'Login';

    // Notifications
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    const formSubmit = async (event) => {
        event.preventDefault();

        const body = {username, email, password}

        if(isLogin){
            body.email = email;
        }
        
        const data = await callApi({
            url: `users/${action}`,
            body: body,
            method: 'POST',
        });
        
        if (typeof data === 'object') {
            const token = data.token

            localStorage.setItem( 'capstone-token', data.token );
            setToken(data.token);
            setUserData(data.user);
            history.push('/products');
        } else{
            setError(`Error: ${data}`)
            handleClick();
        }
    };

return (
    <>
        <form className={classes.form} onSubmit={formSubmit}>

            <h2 id="registerhead">Welcome, Please {title}</h2>

            <TextField 
                className={classes.input}
                type="text" 
                label="Username" 
                required
                minLength="3"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            {isLogin ?  null :
            <TextField 
                className={classes.input}
                type="email" 
                label="Email" 
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            }

            <TextField 
                className={classes.input}
                type="password" 
                label="Password" 
                required
                minLength="8"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <Button 
                variant="contained" 
                className= {classes.button} 
                type="submit">
                {title}

            </Button>

            <p> {isLogin ? "Don't have" : 'Have'} an Account?</p>
            <Button 
                variant="contained" 
                className= {classes.button} 
                type="submit">
                <Link className={classes.link} to={`/${oppositeAction}`}>{oppositeTitle}</Link>
            </Button>
        </form>
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
                {error}
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
                </IconButton>
            </>
            }
        />
    </>
    );
};

export default UserForm;