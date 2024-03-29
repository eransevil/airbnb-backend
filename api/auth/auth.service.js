const bcryptjs = require('bcryptjs')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)
    console.log('password:',password);
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcryptjs.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname, imgUrl) {
    const saltRounds = 10
    
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')
    
    const user = userService.getByUsername(username);
    if (user) Promise.reject('Username is alrady taken.');

    const hash = await bcryptjs.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname , imgUrl})
}



module.exports = {
    signup,
    login,
}