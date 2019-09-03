window.Constant = 100000
window.win = 100000000000000000
window.scores = {
    OpenThree: 100000,
    CappedThree: 10000,
    ConsecutiveFive: 10000000,
    OpenFour: 1000000,
    CappedFour: 100050,
    GappedThree: 100000,
    GappedFour: 100050,
    GappedTwoTwo: 100050,
}
window.count = {
    OpenThree: 0,
    CappedThree: 0,
    ConsecutiveFive: 0,
    OpenFour: 0,
    CappedFour: 0,
    GappedThree: 0,
    GappedFour: 0,
    GappedTwoTwo: 0
}
cc.Class({
    extends: cc.Component,
    properties: {
        cell: cc.Prefab,
        size: 20,
        cellSize: 35,
        alert: cc.Node,
        btnReset: cc.Button,
        btnTop: cc.Button,
        lbTurn: cc.Label,
        lbTime: cc.Label,
        matrix: [],
        isX: false,
        isFinished: true
    },
    onLoad() {
        document.body.style.background = 'lightblue'
    },
    init(username = localStorage.username) {
        if (typeof username == 'object') {
            const item = {
                name: localStorage.username + ' gà quá bỏ cuộc',
                time: this.time,
                opponent: 'Bot',
                userWin: false
            }
            this.toLeaderBoard(item)
        }
        else localStorage.username = username
        this.depth = 1
        this.isX = true
        this.time = 0
        this.matrix = []
        this.isFinished = false
        const emptyRow = new Array(this.size).fill(null)
        for (let i = 0; i < this.size; i++)
            this.matrix.push([...emptyRow])
        this.node.removeAllChildren(true)
        this.makeNewCell(this.randomBet(0, 19), this.randomBet(0, 19))
    },
    start() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClick.bind(this));
    },
    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onClick.bind(this));
    },
    onClick(e) {
        if (this.isFinished) return
        const { _x, _y } = e;
        const { isX, cellSize, size } = this
        if (isX) return //AI
        let row, col
        col = Math.floor(_x / cellSize)
        row = size - Math.floor(_y / cellSize) - 1
        if (this.matrix[row][col]) {
            return
        }
        this.makeNewCell(row, col)

        //
        this.scheduleOnce(() => {
            this.AIMove(this.matrix)
        }, 0.001)
        //
    },
    makeNewCell(row, col) {
        const val = this.isX ? 'X' : 'O'
        const { isX, cellSize, size } = this
        let posPixcel = cc.v2(cellSize * ((col + 0.5)), cellSize * (size - (row + 0.5)));
        this.matrix[row][col] = val
        const newCell = cc.instantiate(this.cell)
        newCell.setPosition(posPixcel)
        this.node.addChild(newCell)
        newCell.getComponent("Cell").show(isX)
        //
        const personWin = this.checkWin(this.matrix, val, [row, col])
        if (personWin) {
            this.isFinished = true
            const username = localStorage.username
            const str = personWin == 'X' ?
                'Bot win! He are the best in the world.\n You are so stupid !'
                : 'You win! You are the best. \nCheck leaderboard now! '
            this.scheduleOnce(() => {
                let lose = [' thua sấp mặt Bot', ' bị Bot cho ăn hành',
                    ' quá gà so với Bot', ' thua tâm phục khẩu phục']
                let win = [' ăn may đánh bại Bot', ' ăn may mới thắng Bot',
                    ' vật vã mới thắng Bot', ' hên vl mới thắng Bot']
                let idx = this.randomBet(0, 3)
                const item = {
                    name: username + (personWin != 'X' ? win[idx] : lose[idx]),
                    time: this.time,
                    opponent: 'Bot',
                    userWin: personWin == 'X' ? false : true
                }
                this.toLeaderBoard(item)
                cc.find('Canvas/Alert').getComponent("Alert").show(str)
            }, 0.001)
            return
        }
        this.isX = !this.isX
        this.lbTurn.string = (!this.isX ? 'Your' : 'Bot') + ' turn'
    },
    randomBet(begin, end) {
        return Math.floor(Math.random() * (end + 1)) + begin
    },
    toLeaderBoard(item) {
        cc.find('Canvas/BXH').getComponent("LeaderBoard").addToLeaderBoard(item)
    },
    AIMove(state) {
        if (this.isX) { //AI 
            let board_state = JSON.parse(JSON.stringify(state))
            let bestState = this.minimaxRoot(board_state, true, this.isX, this.depth)
            const nm = this.getBestMove(state, bestState) // x y  
            this.makeNewCell(nm[0], nm[1])
        }
    },
    getBestMove(state, newState) {
        const n = this.size
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (state[row][col] != newState[row][col]) {
                    return [row, col]
                }
            }
        }
        return null
    },
    minimaxRoot(state, isMax, isX, depth) { // return board
        let moves = this.genAllMove(state, isX)
        let bestMove = -win
        let bestMoveFound = moves[0]
        try {
            for (let move of moves) {
                let value = this.minimax(move, isMax, isX, -win, win, depth - 1)
                if (value >= bestMove) {
                    bestMove = value
                    bestMoveFound = move
                }
            }
        } catch (state) {
            return state
        }
        return bestMoveFound
    },
    genAllMove(state, isX) { // return list state
        const val = isX ? 'X' : 'O'
        const rs = []
        const n = this.size
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (state[row][col] == null) {
                    const cpState = JSON.parse(JSON.stringify(state))
                    cpState[row][col] = val
                    rs.push(cpState)
                }
            }
        }
        return rs
    },
    update(dt) {
        if (!this.isFinished) {
            this.time += dt
            this.lbTime.string = this.formatTime(this.time)
        }
    },
    formatTime(time) {
        let sec = Math.floor(time) % 60
        let min = Math.floor(time / 60)
        return `${String(min).length < 2 ? '0' + min : min} : ${String(sec).length < 2 ? '0' + sec : sec} s`
    },
    eval(state, val) {
        const pos = this.getBestMove(state, this.matrix)
        let psWin = this.checkWin(state, val, pos)
        if (psWin == val) {
            return win * win
        }
        else if (psWin == false) {
            let counts = JSON.parse(JSON.stringify(count))
            let counts2 = JSON.parse(JSON.stringify(count))
            const n = this.size
            const m = state
            const isX = this.isX
            let arr = []
            let ele1 = null, ele2 = null, ele3 = null, ele4 = null, ele5 = null
            let kq = 0
            for (let row = 0; row < n; row++) {
                for (let col = 0; col < n; col++) {
                    //ngang 
                    if (col >= 2 && col + 2 <= n - 1) {
                        ele1 = m[row][col - 2]
                        ele2 = m[row][col - 1]
                        ele3 = m[row][col]
                        ele4 = m[row][col + 1]
                        ele5 = m[row][col + 2]
                        arr = [ele1, ele2, ele3, ele4, ele5]
                        counts = this.cal(arr, isX, counts)
                        counts2 = this.cal(arr, !isX, counts2)
                        kq += 2.5 * this.calPriority(arr, isX)
                        if (col - 3 >= 0) {
                            arr = [m[row][col - 3], ele1, ele2, ele3, ele4, ele5]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                        if (col + 3 <= n - 1) {
                            arr = [ele1, ele2, ele3, ele4, ele5, m[row][col + 3]]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                    }
                    if (row >= 2 && row + 2 <= n - 1) {
                        // doc
                        ele1 = m[row - 2][col]
                        ele2 = m[row - 1][col]
                        ele3 = m[row][col]
                        ele4 = m[row + 1][col]
                        ele5 = m[row + 2][col]
                        arr = [ele1, ele2, ele3, ele4, ele5]
                        counts = this.cal(arr, isX, counts)
                        counts2 = this.cal(arr, !isX, counts2)
                        kq += 2.5 * this.calPriority(arr, isX)
                        if (row - 3 >= 0) {
                            arr = [m[row - 3][col], ele1, ele2, ele3, ele4, ele5]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                        if (row + 3 <= n - 1) {
                            arr = [ele1, ele2, ele3, ele4, ele5, m[row + 3][col]]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                    }
                    if (row >= 2 && col >= 2 && col + 2 <= n - 1 && row + 2 <= n - 1) {
                        //cheo 1
                        ele1 = m[row - 2][col - 2]
                        ele2 = m[row - 1][col - 1]
                        ele3 = m[row][col]
                        ele4 = m[row + 1][col + 1]
                        ele5 = m[row + 2][col + 2]
                        arr = [ele1, ele2, ele3, ele4, ele5]
                        counts = this.cal(arr, isX, counts)
                        counts2 = this.cal(arr, !isX, counts2)
                        kq += 2.5 * this.calPriority(arr, isX)
                        if (row >= 3 && col >= 3) {
                            arr = [m[row - 3][col - 3], ele1, ele2, ele3, ele4, ele5]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                        if (col + 3 <= n - 1 && row + 3 <= n - 1) {
                            arr = [ele1, ele2, ele3, ele4, ele5, m[row + 3][col + 3]]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                    }
                    if (col + 2 <= n - 1 && row >= 2 && col >= 2 && row + 2 <= n - 1) {
                        //cheo 2
                        ele1 = m[row + 2][col - 2]
                        ele2 = m[row + 1][col - 1]
                        ele3 = m[row][col]
                        ele4 = m[row - 1][col + 1]
                        ele5 = m[row - 2][col + 2]
                        arr = [ele1, ele2, ele3, ele4, ele5]
                        counts = this.cal(arr, isX, counts)
                        counts2 = this.cal(arr, !isX, counts2)
                        kq += 2.5 * this.calPriority(arr, isX)
                        if (row + 3 <= n - 1 && col >= 3) {
                            arr = [m[row + 3][col - 3], ele1, ele2, ele3, ele4, ele5]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                        if (col + 3 <= n - 1 && row >= 3) {
                            arr = [ele1, ele2, ele3, ele4, ele5, m[row - 3][col + 3]]
                            counts = this.cal(arr, isX, counts)
                            counts2 = this.cal(arr, !isX, counts2)
                        }
                    }
                }
            }
            for (let key of Object.keys(scores)) {
                kq += counts[key] * scores[key]
                kq += -counts2[key] * scores[key]
            }
            return kq + (Constant - this.totalDis(pos, state))
        }
        else {
            return -win * win
        }

    },
    calPriority(arr, isX) {
        let val = isX ? 'X' : 'O'
        let Oval = !isX ? 'X' : 'O'
        let rs = 0
        if (arr[0] == null && arr[1] == Oval && arr[2] == Oval && arr[3] == Oval && arr[4] == val) {
            rs += scores.CappedThree
        }
        if (arr[0] == val && arr[1] == Oval && arr[2] == Oval && arr[3] == Oval && arr[4] == null) {
            rs += scores.CappedThree
        }
        if (arr[0] == val && arr[1] == Oval && arr[2] == Oval && arr[3] == Oval && arr[4] == Oval) {
            rs += win / 2
        }
        if (arr[0] == Oval && arr[1] == Oval && arr[2] == Oval && arr[3] == Oval && arr[4] == val) {
            rs += win / 2
        }
        if (arr[0] == Oval && arr[1] == Oval && arr[2] == val && arr[3] == Oval && arr[4] == Oval) {
            rs += win / 2
        }
        if (arr[0] == Oval && arr[1] == Oval && arr[2] == Oval && arr[3] == val && arr[4] == Oval) {
            rs += win / 2
        }
        if (arr[0] == Oval && arr[1] == val && arr[2] == Oval && arr[3] == Oval && arr[4] == Oval) {
            rs += win / 2
        }
        if (arr[0] == null && arr[1] == Oval && arr[2] == Oval && arr[3] == val && arr[4] == Oval) {
            rs += win / 2
        }
        if (arr[0] == Oval && arr[1] == val && arr[2] == Oval && arr[3] == Oval && arr[4] == null) {
            rs += win / 2
        }
        return rs
    },
    totalDis(pos, state) {
        let rs = 0
        const n = this.size
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (state[row][col] != null) {
                    rs += Math.abs(col - pos[1]) + Math.abs(row - pos[0])
                }
            }
        }
        return rs
    },
    minimax(board_state, isMax, isX, alpha, beta, current_depth) {
        const val = isX ? 'X' : 'O'
        if (current_depth == 0)
            return this.eval(board_state, val)
        let next_moves = this.genAllMove(board_state, isX)
        let bestMove
        if (!isMax) {
            bestMove = win
            for (let node of next_moves) {
                bestMove = Math.min(bestMove, this.minimax(node, true, !isX, alpha, beta, current_depth - 1))
                //beta = Math.min(beta, bestMove) 
                //cc.log(alpha, beta)
                // if (beta <= alpha) {
                //     return bestMove
                // }
            }
        }
        // else {
        //     bestMove = -win
        //     for (let node of next_moves) {
        //         bestMove = Math.max(bestMove, this.minimax(node, false, !isX, alpha, beta, current_depth - 1))
        //         alpha = Math.max(2, alpha, bestMove)
        //         if (beta <= alpha) {
        //             return bestMove
        //         }
        //     }
        // }
        return bestMove
    },
    cal(arr, isX, counts) {
        if (arr.every(e => e === null)) {
            return counts
        }
        const val = isX ? 'X' : 'O'
        const oVal = isX ? 'O' : 'X'
        const isEqual = (arr) => arr.every(e => e === val)
        const length = arr.length
        const last = arr[length - 1]
        const first = arr[0]
        if (length == 6) {
            if (isEqual(arr.slice(1, -1)) && first == null && last == null) {
                counts.OpenFour++
            }
            if (isEqual(arr.slice(1, -1))) {
                if (first == oVal && last == null) {
                    counts.CappedFour++
                } else if (first == null && last == oVal) {
                    counts.CappedFour++
                }
            }
        } else if (length == 5) {
            if (isEqual(arr.slice(1, 4))) {  // 3 ele giua = nhau = val  
                if (first == null && last == oVal) {
                    counts.CappedThree++
                } else if (first == oVal && last == null) {
                    counts.CappedThree++
                } else if (first == null && last == null) {
                    counts.OpenThree++
                } else if (first == val && last == val) {
                    counts.ConsecutiveFive++
                }
            }
            if (isEqual(arr.slice(1)) && first == null) {  //4 ele cui =val 
                counts.GappedFour++
            }
            if (isEqual(arr.slice(0, -1)) && last == null) {  //4 ele dau = val  
                counts.GappedFour++
            }
            if (first == val && arr[1] == val && arr[2] == null && arr[3] == val && arr[4] == val) {
                counts.GappedTwoTwo++
            }
            if (isEqual(arr.slice(0, 3)) && last == val && arr[length - 2] == null) {
                counts.GappedThree++
            }
            if (isEqual(arr.slice(2)) && first == val && arr[1] == null) {
                counts.GappedThree++
            }
        }
        return counts
    },
    checkWin(state, val, pos) {
        const n = this.size
        const m = state
        let arr = []
        let ele1 = null, ele2 = null, ele3 = null, ele4 = null, ele5 = null
        const r1 = pos[0] - 4
        const r2 = pos[0] + 4
        const c1 = pos[1] - 4
        const c2 = pos[1] + 4
        for (let row = r1; row <= r2; row++) {
            if (row < 0 || row > n - 1) {
                continue
            }
            for (let col = c1; col <= c2; col++) {
                //ngang  
                if (col < 0 || col > n - 1) continue
                if (m[row][col] == null) continue
                if (col >= 2 && col + 2 <= n - 1) {
                    ele1 = m[row][col - 2]
                    ele2 = m[row][col - 1]
                    ele3 = m[row][col]
                    ele4 = m[row][col + 1]
                    ele5 = m[row][col + 2]
                }
                arr = [ele1, ele2, ele3, ele4, ele5, val]
                let rs = this.isEqual(arr)
                if (rs)
                    return rs
                if (row >= 2 && row + 2 <= n - 1) {
                    // doc
                    ele1 = m[row - 2][col]
                    ele2 = m[row - 1][col]
                    ele3 = m[row][col]
                    ele4 = m[row + 1][col]
                    ele5 = m[row + 2][col]
                }
                arr = [ele1, ele2, ele3, ele4, ele5, val]
                rs = this.isEqual(arr)
                if (rs)
                    return rs
                if (row >= 2 && col >= 2 && col + 2 <= n - 1 && row + 2 <= n - 1) {
                    //cheo 1
                    ele1 = m[row - 2][col - 2]
                    ele2 = m[row - 1][col - 1]
                    ele3 = m[row][col]
                    ele4 = m[row + 1][col + 1]
                    ele5 = m[row + 2][col + 2]
                }
                arr = [ele1, ele2, ele3, ele4, ele5, val]
                rs = this.isEqual(arr)
                if (rs)
                    return rs
                if (col + 2 <= n - 1 && row >= 2 && col >= 2 && row + 2 <= n - 1) {
                    //cheo 2
                    ele1 = m[row + 2][col - 2]
                    ele2 = m[row + 1][col - 1]
                    ele3 = m[row][col]
                    ele4 = m[row - 1][col + 1]
                    ele5 = m[row - 2][col + 2]
                }
                arr = [ele1, ele2, ele3, ele4, ele5, val]
                rs = this.isEqual(arr)
                if (rs)
                    return rs
            }
        }
        return false
    },
    isEqualUtils(arr) {
        return arr.every(e => e === arr[0])
    },
    isEqual(arr) {
        if (this.isEqualUtils(arr))
            return arr[0];
        else return false
    }
});
