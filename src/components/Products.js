import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Snackbar, IconButton } from '@material-ui/core';



const Products = ({ products }) => {
    
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
            backgroundColor: "#4CAF50"
        }
    }))
    
    
    
    
    
    const [searchQuery, updateSearchQuery] = useState('')
    const [category, setCategory] = useState('')
    let productsToDisplay = products;

    function productMatches(product, text) {
        const searchTerm = text.toLowerCase();
    
        const {
            title,
            price,
            category,
        } = product;
        
        const toMatch = [title, price, category];
    
        for (const field of toMatch) {
            if (field.toString().toLowerCase().includes(searchTerm)) {
                return true
            }
        }
        return false
    };

    if(searchQuery.length > 0) {
        productsToDisplay = products.filter((product) => productMatches(product, searchQuery))
    } else if(category) {
        productsToDisplay = products.filter((product) => product.category === category)
    } else {
        productsToDisplay = products
    }

    return (
        <>
            <h2 id="productstitle">Products</h2>

            <h2>Search</h2>
            <input 
                type = "text" 
                placeholder='search products' 
                value = {searchQuery} 
                onChange = {(event) => {updateSearchQuery(event.target.value)}}
            />
            <div id="form">
                <form>
                    <h2>Search By category</h2>
                    <div>
                    <fieldset>
                        <select
                           onChange={(event) => setCategory(event.target.value)}>
                            <option value="any">Select Category</option>
                            <option value="coffee">Coffee</option>
                            <option value="coffee maker">Coffee Maker</option>
                            <option value="furniture">Furniture</option>
                            <option value="gift">Gift</option>                           
                            <option value="mug">Mug</option>
                            <option value="wall art">Wall Art</option>
                            <option value="other">Other</option>
                        </select>
                    </fieldset>
                    </div>
                </form>
            </div>

                {productsToDisplay?.map((product) => (
                    <div key={product.id} style={{ border: '1px solid black' }}>
                        <h3>{product.title}</h3>
                        <h3>${product.price}</h3>
                        <div>{product.category}</div>
                        <img  style={{ maxWidth:"150px", height: "auto"}} src={product.image}></img>
                        <Button>
                            <Link to={`/products/${product.id}`}>View Product</Link>
                        </Button>
                    </div>
                ))}
            </>
        );
    };
        
export default Products;
