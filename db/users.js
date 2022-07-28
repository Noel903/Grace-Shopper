const { client }= require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser({ username, password, email, isAdmin = false}) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {rows: [user]} = await client.query(`
    INSERT INTO users(username, password, email, "isAdmin") 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (username, email) DO NOTHING 
    RETURNING id, username, email;
    `, [username, hashedPassword, email, isAdmin]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function editEmail({ email, userId }) {
  try {
    const { rows: [ newEmail ] } = await client.query(`
    UPDATE users
    SET email=$1
    WHERE id=$2
    RETURNING id, username, email;
    `, [email, userId]);
    return newEmail;
  } catch(error) {
      throw error;
  }
}

async function getUser({username, password}) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if(!user) return;

    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if(!passwordsMatch) return;

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}
  
async function getUserById(userId) {
  try {
    const {rows: [user]} = await client.query(`
    SELECT id, username, email, "isAdmin"
    FROM users
    WHERE id = $1;
    `, [userId]);

    if (!user) return null;
    return user;  
  } catch (error) {
      throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {rows: [ user ] } = await client.query(`
    SELECT id, username, password, email
    FROM users
    WHERE username = $1;
    `, [userName]);

  if (!user) return null;

  return user;
  } catch (error) {
  console.error(error)
  }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    editEmail
}