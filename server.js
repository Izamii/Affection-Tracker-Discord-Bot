const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Result: [OK]');
});



const keepAlive = () => {
    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
}


module.exports = {
    keepAlive
}