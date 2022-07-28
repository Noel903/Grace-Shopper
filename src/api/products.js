import { callApi } from './';

export const createProduct = async ({title, description, price, inventoryQuantity, category, image, token}) => {
    const data = await callApi({
        method: 'POST',
        url: 'products/',
        body: {
            title, 
            description, 
            price, 
            inventoryQuantity, 
            category, 
            image
        },
        token
    });
    return data;
};

export const getAllProducts = async () => {
    const data = await callApi({
        url: `products/`
    });
    return data;
};

export const getProductById = async (id) => {
    const data = await callApi({
        url: `products/${id}`
    });
    return data;
};

export const getProductsByCategory = async (category) => {
    const data = await callApi({
        url: `products/category/${category}`
    });
    return data;
};

export const editItem = async (body, token) => {
    const data = await callApi({
        method: 'PATCH',
        url: `products/adminedit`,
        body,
        token
    });

    console.log('data: ', data);    
    return data;
};
