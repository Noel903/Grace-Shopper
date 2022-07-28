// export
module.exports = {
    ...require('./client'),
    ...require('./products'),
    ...require('./users'),
    ...require('./reviews'),
    ...require('./orders'),
    ...require('./checkouts')
}