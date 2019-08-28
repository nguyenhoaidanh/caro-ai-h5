
cc.Class({
    extends: cc.Component,
    properties: { // 50px 1 o
        lbX: cc.Label,
        lbO: cc.Label
    },
    show(isX) {
        this.lbX.node.active = isX
        this.lbO.node.active = !isX
        const node = isX ? this.lbX.node : this.lbO.node
        const color = isX ? cc.Color.BLUE : cc.Color.RED  
        node.color = cc.Color.GREEN 
        setTimeout(()=>{
            node.color = color
        },1*1000)
    }

});
