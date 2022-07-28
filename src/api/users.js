import { callApi } from './';

export const userLogin = async ({username, password}) => {
    const data = await callApi({
        method: 'POST',
        url: 'users/login',
        body: {
            username,
            password
        }
    });
    return data;
};

export const userRegister = async ({username, email, password}) => {
    const data = await callApi({
        method: 'POST',
        url: 'users/register',
        body: {
            username, 
            email, 
            password
        }
    });
    return data;
};

export const getUser = async (token) => {
    const data = await callApi({
        url: 'users/me',
        token
    });
    return data;
};

export const updateEmail = async ({token, userId, email}) => {
    const data = await callApi({
        url: 'users/me',
        method: "PATCH",
        body:{
            userId:userId,
            email:email
        },
        token
    });
    return data;
};

export const getUsersOrders = async (userId, token) => {
    const data = await callApi({
        url: `users/${userId}/orders`,
        token
    });
    return data;
};

export const fetchAllUserCheckoutsbyUserId = async (userId,token) => {
    const data = await callApi({
        url: `users/${userId}/checkouts`,
        token
    });
    return data;
}
