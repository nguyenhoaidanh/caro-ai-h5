cc.Class({
    extends: cc.Component,
    properties: {
        lbContent: cc.Label,
        btnClose: cc.Button
    },
    replay() {
        this.node.active = false
        cc.find('Canvas/banco').getComponent('Code').init()
    },
    show(msg) {
        this.lbContent.string = msg 
        this.node.active = true
    }
});
