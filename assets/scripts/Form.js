

cc.Class({
    extends: cc.Component,

    properties: {
        input: cc.EditBox,
        game: cc.Node,
        lbUsername: cc.Label
    },

    submit() {
        const name = this.input.string.trim()
        if (name) {  
            this.game.getComponent('Code').init(name)
            this.lbUsername.string = name.length > 8 ? name.substr(0,5)+'...' : name
            this.hide()
        }
    },
    show() {
        this.node.active = true
    },
    hide() {
        this.node.active = false
    }
});
