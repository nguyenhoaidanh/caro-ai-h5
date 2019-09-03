const express = require('express');
const router = express.Router();
var Firebase = require('firebase');
Firebase.initializeApp({
    databaseURL: "https://caro-ai-h5.firebaseio.com/",
    serviceAccount: './key.json'
});
console.log('init firebase');

var db = Firebase.database();
var usersRef = db.ref("/caro/BevZq4aG8qCUoi0mgoDc");
router.post('/', (req, res) => {
    let now = new Date()
    let str = `${now.getDay() + 1}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()+7}:${now.getMinutes()}`
    var { name, time, opponent, userWin } = req.body;
    const newItem = ({ name, time, opponent, userWin, date: str });
    usersRef.push(newItem);
    res.send(newItem)
});
router.get('/', (req, res) => {
    usersRef.once("value", function (snapshot) {
        let data = snapshot.val() || []
        data = Object.values(data)
        let dataw = data.filter(e => e.userWin == true)
        dataw = dataw.sort((a, b) => a.time > b.time)
        let datal = data.filter(e => e.userWin == false)
        datal = datal.sort((a, b) => a.time < b.time)
        data = [...dataw, ...datal]
        res.send(data)
    })
});
router.get('/del', (req, res) => {
    usersRef.remove();
    res.send('remove ok')
});
router.delete('/', (req, res) => {
    usersRef.remove();
    res.send('remove ok')
});
module.exports = router; 