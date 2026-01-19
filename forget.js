const bcrypt = require('bcrypt');
const password = '123456';
const saltRounds = 10; // Or a value like 12 for higher security

bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store this 'hash' in your MongoDB user document
    console.log(hash);
});
