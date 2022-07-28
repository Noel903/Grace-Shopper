import { callApi } from './';

export const createReview = async ({productId, userId, message}) => {
    const data = await callApi({
        method: 'POST',
        url: `reviews/`,
        body: {
            productId, 
            userId, 
            message
        },
    });
    return data;
};

export const deleteReview = async (reviewId) => {
    const data = await callApi({
        method: 'DELETE',
        url: `reviews/${reviewId}`
    });
    return data;
};

export const getReviewById = async (reviewId) => {
    const data = await callApi({
        url: `reviews/${reviewId}`
    });
    return data;
};

export const getReviewsByUser = async (userId) => {
    const data = await callApi({
        url: `reviews/user/${userId}`
    });
    return data;
};

export const getReviewsByProduct = async (productId) => {
    const data = await callApi({
        url: `reviews/product/${productId}`
    });
    return data;
};
