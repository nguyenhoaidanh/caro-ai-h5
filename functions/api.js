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
    let str = `${now.getDay() + 1}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours() + 7}:${now.getMinutes()}`
    var { name, time, opponent, userWin } = req.body;
    const newItem = ({ name, time, opponent, userWin, date: str });
    usersRef.push(newItem);
    res.send(newItem)
});
function sort(a, field, increase) {
    let n = a.length
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (a[i][field] < a[j][field]) {
                let tg = a[i];
                a[i] = a[j];
                a[j] = tg;
            }
        }
    }
    if (increase != 1)
        return a
    else return a.reverse()
}
router.get('/', (req, res) => {
    usersRef.once("value", function (snapshot) {
        let data = snapshot.val() || []
        data = Object.values(data)
        let dataw = data.filter(e => e.userWin == true)
        dataw = sort(dataw, 'time', 1)
        let datal = data.filter(e => e.userWin == false)
        datal = sort(datal, 'time', -1)
        data = [...dataw, ...datal]
        res.send(data)
    })
});
router.get('/:id', (req, res) => {
    let id = req.params.id
    usersRef.child(id).once("value", function (snapshot) {
        let data = snapshot.val() || {}
        res.send(data)
    })
});
router.get('/includes/:string', (req, res) => {
    let string = req.params.string
    usersRef.once("value", function (snapshot) {
        let data = snapshot.val() || {}
        let rs = []
        let vals = Object.values(data)
        let keys = Object.keys(data)
        for (let i in vals) {
            if (vals[i].name.toLowerCase().includes(string.toLowerCase())) {
                vals[i].id = keys[i]
                rs.push(vals[i])
            }
        }
        res.send(rs)
    })
});
router.delete('/includes/:string', (req, res) => {
    let string = req.params.string
    usersRef.once("value", function (snapshot) {
        let data = snapshot.val() || {}
        let rs = []
        let vals = Object.values(data)
        let keys = Object.keys(data)
        for (let i in vals) {
            if (vals[i].name.includes(string)) { 
                usersRef.child(keys[i]).remove()
                rs.push(keys[i])
            }
        }
        res.send(rs)
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