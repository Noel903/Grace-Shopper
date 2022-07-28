import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { editItem } from '../api';


const AdminEditPost = ({product, token}) => {
    const history = useHistory();
    const [id, setId] = useState(product.id);
    const [title, setTitle] = useState(product.title);
    const [price, setPrice] = useState(product.price);
    const [category, setCategory] = useState(product.category);
    const [inventoryQuantity, setInventoryQuantity] = useState(product.inventoryQuantity);
    const [image, setImage] = useState(product.image);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = await editItem({id, price, image, inventoryQuantity, category, title}, token);
        history.push('/products');
    }

    return (
        <>
            <h2></h2>
            <form onSubmit={handleSubmit}>
                <div id ="TextField">
                <input
                    type="text"
                    placeholder="Product Title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}

                ></input>
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}

                ></input>
                <input
                    type="number"
                    placeholder="Quantity"
                    value={inventoryQuantity}
                    onChange={(event) => setPrice(event.target.value)}

                ></input>
                <div id="form">
                    <h2>Category</h2>
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
            </div>
                <input
                    type="text"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                ></input>
                </div>
                <button type="submit">Submit Changes</button>
            </form>
        </>
        );
        }
        export default AdminEditPost;
