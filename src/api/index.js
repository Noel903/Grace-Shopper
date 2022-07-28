export const API_URL = 'https://fsa-capstone.herokuapp.com/api/';

export const callApi = async ({ url, method, token, body }) => {
    try {
        const options = {
            method: method ? method.toUpperCase() : 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL + url, options);
        const data = await response.json();
        if (data.error) {
            throw data.error;
        }

        return data;
    } catch (error) {
        return error;
    }
};

export * from './orders';
export * from './products';
export * from './reviews';
export * from './users';
