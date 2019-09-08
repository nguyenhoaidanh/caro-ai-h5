

import Axios from 'axios'
cc.Class({
    extends: cc.Component,
    properties: {
        userItem: cc.Prefab,
        content: cc.Node,
        userItems: [],
        inputSearch: cc.EditBox,
        btnSearch: cc.Button
    },
    start() {
        this.getReq()
    },
    addToLeaderBoard(item, psWin) {
        this.postReq(item)
    },
    showListTop() {
        this.content.removeAllChildren(true)
        let y = 50;
        let x = 0;
        let step = 90;
        this.content.height=y
        this.userItems.forEach(item => {
            y -= step
            const tem = cc.instantiate(this.userItem)
            tem.position = cc.v2(x, y)
            tem.getComponent('UserItem').lbName.string = item.name
            tem.getComponent('UserItem').lbTime.string = this.formatTime(item.time)
            tem.getComponent('UserItem').lbDate.string = item.date
            if (item.userWin) {
                tem.getComponent('UserItem').ava2.active = false
            } else tem.getComponent('UserItem').ava1.active = false
            this.content.addChild(tem)
            this.content.height += step
        });
    },
    formatTime(time) {
        let sec = Math.floor(time) % 60
        let min = Math.floor(time / 60)
        return `${String(min).length < 2 ? '0' + min : min} : ${String(sec).length < 2 ? '0' + sec : sec} s`
    },
    show() { 
        this.inputSearch.string = ''
        this.getReq()
        this.node.active = true
    },
    hide() {
        this.node.active = false
    },
    getReq() {
        Axios.get(config.api_domain)
            .then(data => {
                this.userItems = data.data
                this.showListTop()
            })
            .catch(err => console.log('in leaderboard ' + err))
    },
    getReqByName() {
        let name = this.inputSearch.string.trim()
        Axios.get(config.api_domain + 'includes/' + name)
            .then(data => {
                this.userItems = data.data 
                this.showListTop() 
            })
            .catch(err => console.log('in leaderboard ' + err))
    },
    postReq(item) {
        Axios.post(config.api_domain, item)
            .then(() => this.getReq())
            .catch(err => console.log('in leaderboard ' + err))
    }
});
