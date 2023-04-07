function seed(dbName, user, password) {
    db = db.getSiblingDB(dbName)
    db.createUser({
        user: user,
        pwd: password,
        roles: [{ role: 'readWrite', db: dbName }],
    })

    db.createCollection('users')

    db.users.insert({
        account: 'justin',
        password: '$2a$10$UlLTzEx7kP6wq66XhN3jJe6wn6gh4qhJl4XqhGKQ32LKaUfghCdH6',
    })

    
}

seed('edcsystem', 'amkortestit', 'abc5383101')
