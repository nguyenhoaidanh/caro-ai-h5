

import Axios from 'axios'
cc.Class({
    extends: cc.Component,
    properties: {
        userItem: cc.Prefab,
        content: cc.Node,
        userItems: []
    },
    start() {
        this.getReq()
    },
    addToLeaderBoard(item, psWin) {
        if (psWin == 'O') { // you win
            this.postReq(item) 
        }
    },
    showListTop() {
        let y = -20;
        let x = 0;
        let step = 90;
        this.userItems.forEach(item => {
            y -= step
            const tem = cc.instantiate(this.userItem)
            tem.position = cc.v2(x, y)
            tem.getComponent('UserItem').lbName.string = item.name
            tem.getComponent('UserItem').lbTime.string = item.time
            this.content.addChild(tem)
            this.content.height += step / 1.2
        });
    },
    show() {
        this.node.active = true
    },
    hide() {
        this.node.active = false
    },
    getReq() {
        Axios.get(config.api_domain)
            .then(data => {
                this.userItems = data.data.data
                this.showListTop()
            })
            .catch(err => console.log('in leaderboard ' + err))
    },
    postReq(item) {
        Axios.post(config.api_domain, item)
        .then(()=>this.getReq())
            .catch(err => console.log('in leaderboard ' + err))
    }
});
