var mongoose = require('mongoose')
const db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PWD || '',
}
module.exports = () => {
    mongoose.set('strictQuery', false)

    const dbURI = `mongodb+srv://${db.user}:${encodeURIComponent(
        db.password
    )}@${db.host}/${db.name}`
    const options = {
        autoIndex: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
    }
    mongoose
        .connect(dbURI, options)
        .then(() => {
            console.info('Mongoose connection done')
        })
        .catch((e) => {
            console.info('Mongoose connection error')
            console.error(e)
        })

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.once('connected', () => {
        console.info('Mongoose default connection open to ' + dbURI)
    })

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose default connection error: ' + err)
    })

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
        console.info('Mongoose default connection disconnected')
    })

    // // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.info(
                'Mongoose default connection disconnected through app termination'
            )
            process.exit(0)
        })
    })
}
