
db.createUser({
    user: dbUser,
    pwd: dbPassword,
    roles: [
        {role: "readWrite", db: dbName},
        {role: "dbOwner", db: dbName}
    ]
});
