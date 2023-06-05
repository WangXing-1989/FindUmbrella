export const Config = {
    level_0: { // 练习模式
        raw: 3, // 行数
        col: 3, // 列数
        count: 1, // 一共需要答几次
        need: 1, // 需要答对几次才能过关
        type: 1, // 1:单色伞， 2:双色伞
        isTime: false, // 是否需要倒计时
        time: 10, // 倒计时秒数
        isIntegral: false, // 是否有积分
        integral: 0, // 积分
        title: "练习模式",
        rule1: "游戏规则：\n1）下方是您的伞，请您记住它的样式。",
        rule2: "游戏规则：\n2）请在以下伞中，找到您的伞，并用手指点击它"
    },
    level_1: { // 难度1
        raw: 3, // 行数
        col: 3, // 列数
        count: 5, // 一共需要答几次
        need: 5, // 需要答对几次才能过关
        type: 1, // 1:单色伞， 2:双色伞
        isTime: true, // 是否需要倒计时
        time: 10, // 倒计时秒数
        isIntegral: true, // 是否有积分
        integral: 10, // 积分
        title: "难度一",
        rule1: "这是您的伞，请您记住它的样式。",
        rule2: "请找到您的伞，并用手指点击它"
    },
    level_2: { // 难度2
        raw: 4, // 行数
        col: 4, // 列数
        count: 5, // 一共需要答几次
        need: 4, // 需要答对几次才能过关
        type: 1, // 1:单色伞， 2:双色伞
        isTime: true, // 是否需要倒计时
        time: 10, // 倒计时秒数
        isIntegral: true, // 是否有积分
        integral: 10, // 积分
        title: "难度二",
        rule1: "这是您的伞，请您记住它的样式。",
        rule2: "请找到您的伞，并用手指点击它"
    },
    level_3: { // 难度3
        raw: 3, // 行数
        col: 3, // 列数
        count: 5, // 一共需要答几次
        need: 4, // 需要答对几次才能过关
        type: 2, // 1:单色伞， 2:双色伞
        isTime: true, // 是否需要倒计时
        time: 10, // 倒计时秒数
        isIntegral: true, // 是否有积分
        integral: 10, // 积分
        title: "难度三",
        rule1: "这是您的伞，请您记住它的样式。",
        rule2: "请找到您的伞，并用手指点击它"
    },
    level_4: { // 难度4
        raw: 4, // 行数
        col: 4, // 列数
        count: 5, // 一共需要答几次
        need: 4, // 需要答对几次才能过关
        type: 2, // 1:单色伞， 2:双色伞
        isTime: true, // 是否需要倒计时
        time: 10, // 倒计时秒数
        isIntegral: true, // 是否有积分
        integral: 10, // 积分
        title: "难度四",
        rule1: "这是您的伞，请您记住它的样式。",
        rule2: "请找到您的伞，并用手指点击它"
    }
}