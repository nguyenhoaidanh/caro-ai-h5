cc.Class({
    extends: cc.Component,
    properties: {
        lbContent: cc.Label,
        btnClose: cc.Button
    }, 
    onLoad() {
        this.btnClose.node.on('click', this.onClick,this);
    },
    onClick(e){
        this.node.active = false
        cc.find('Canvas/banco').getComponent('Code').init()
    },
    show(msg) {
        this.lbContent.string = msg
        this.node.active = true
    }
});
