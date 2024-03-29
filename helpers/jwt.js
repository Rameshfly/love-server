const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        // isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

// async function isRevoked(req, payload, done) {
//     if(!payload.isAdmin) {
//         done(null, true); //Not an admin => rejected
//     }
//     done(); //accepted (admin)
// }

module.exports = authJwt;