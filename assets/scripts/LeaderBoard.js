

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
        this.postReq(item)
    },
    showListTop() {
        let y = -20;
        let x = 0;
        let step = 90;
        this.userItems.forEach(item => {
            y -= step
            const tem = cc.instantiate(this.userItem)
            tem.position = cc.v2(x, y)
            let lose = [' thua sấp mặt Bot', ' bị Bot cho ăn hành',
                ' quá gà so với Bot', ' thua tâm phục khẩu phục']
            let win = [' ăn may đánh bại Bot', ' ăn may mới thắng Bot',
                ' vật vã mới thắng Bot', ' hên vl mới thắng Bot']
            let begin = 0
            let end = 3
            let idx = Math.floor(Math.random() * (end + 1)) + begin
            tem.getComponent('UserItem').lbName.string = '"' + item.name+ '"' + (item.userWin ? win[idx] : lose[idx])
            tem.getComponent('UserItem').lbTime.string = 'Time: ' + item.time
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
            .then(() => this.getReq())
            .catch(err => console.log('in leaderboard ' + err))
    }
});
