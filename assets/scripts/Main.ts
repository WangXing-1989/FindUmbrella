import { Config } from "./Config";
import GHttp from "./GHttp";
import Result from "./Result";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Label)
    level: cc.Label = null;

    @property(cc.Label)
    integral: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    rule: cc.Label = null;

    @property(cc.Sprite)
    target: cc.Sprite = null;

    @property(cc.Node)
    listPanel: cc.Node = null;

    @property(Result)
    result: Result = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    hand: cc.Node = null;

    @property(cc.Prefab)
    san: cc.Prefab = null;

    @property(cc.AudioClip)
    audioBg: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioCover: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioRight: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioWrong: cc.AudioClip = null;

    @property(cc.AudioClip)
    audio1_1: cc.AudioClip = null;

    @property(cc.AudioClip)
    audio1_2: cc.AudioClip = null;

    @property(cc.AudioClip)
    audio2_1: cc.AudioClip = null;

    @property(cc.AudioClip)
    audio2_2: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioSuccess: cc.AudioClip = null;

    @property(cc.AudioClip)
    audioFail: cc.AudioClip = null;

    private index: number = 0;
    private data: any;
    private answer: number = -1; // 本次游戏答案
    private curResult: boolean[]; // 当前题目作答结果
    private allResult: boolean[][]; // 所有题目作答结果
    private _curIntegral: number = 0; // 当前题分数
    private get curIntegral(): number {
        return this._curIntegral;
    }
    private set curIntegral(value: number) {
        this._curIntegral = value;
        this.integral.string = `${this.allIntegral + this.curIntegral}分`;
    }
    private _allIntegral: number = 0; // 总得分
    private get allIntegral(): number {
        return this._allIntegral;
    }
    private set allIntegral(value: number) {
        this._allIntegral = value;
        this.integral.string = `${this.allIntegral + this.curIntegral}分`;
    }
    private curCount: number = 0; // 当前作答次数
    private curTime: number = 0; // 当前剩余倒计时
    private allRightTime: number = 0; // 当前难度所有答对次数总用时
    private handTween: cc.Tween;
    private uploadData: any = { // 上报数据
        totalScore: 0, // 总得分
        firstTaskSuccessCount: 0, // 任务1用户完成正确次数
        firstTaskReaction: 0, // 任务1用户正确反应时
        secondTaskSuccessCount: 0, // 任务2用户完成正确次数
        secondTaskReaction: 0, // 任务2用户正确反应时
        thirdTaskSuccessCount: 0, // 任务3用户完成正确次数
        thirdTaskReaction: 0, // 任务3用户正确反应时
        fourthTaskSuccessCount: 0, // 任务4用户完成正确次数
        fourthTaskReaction: 0, // 任务4用户正确反应时
        LevelDifficultyEnd: 0, // 结束时所处难度水平
    };
    private preTargetIndex: number = -1; // 上一次的目标伞，本次不能跟上一次出现一样的伞

    start() {
        this.init();
    }

    private init() {
        this.target.node.active = true;
        this.listPanel.active = false;
        this.cover.active = true;
        this.cover.opacity = 255;

        cc.audioEngine.playMusic(this.audioBg, true);

        this.index = 0;
        this.uploadData.LevelDifficultyEnd = this.index;
        this.curCount = 0;
        this.allRightTime = 0;
        this.curIntegral = 0;
        this.allIntegral = 0;
        this.uploadData.totalScore = this.allIntegral;
        this.allResult = [];
        this.curResult = [];

        GHttp.instance.login((type) => {
            console.log(type == 1 ? "登录成功" : "登录失败");
        })

        this.playHand();
    }

    public playHand(pos: cc.Vec2 = null) {
        this.hand.active = true;
        this.hand.scale = 1;
        if (pos) {
            this.hand.x = pos.x;
            this.hand.y = pos.y;
        } else {
            this.hand.x = 54;
            this.hand.y = -275;
        }

        this.handTween = cc.tween(this.hand)
            .repeatForever(
                cc.tween()
                    .by(1, { x: 30, y: -30, scale: 0.3 })
                    .by(1, { x: -30, y: 30, scale: -0.3 })
            )
            .start();
    }

    private stopHand() {
        this.handTween && this.handTween.stop();
        this.hand.active = false;
    }

    private clickCover() {
        this.stopHand();
        this.content.opacity = 0;
        cc.tween(this.cover)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.cover.active = false;
                this.index = 0;
                this.uploadData.LevelDifficultyEnd = this.index;
                this.allResult = [];
                this.curCount = 0;
                this.allRightTime = 0;
                this.curResult = [];
                this.curIntegral = 0;
                this.allIntegral = 0;
                this.uploadData.totalScore = this.allIntegral;
                this.showView();
                cc.tween(this.content)
                    .to(0.5, { opacity: 255 })
                    .start();
            })
            .start();
    }

    private showView() {
        this.curCount++;
        this.answer = -1;
        this.data = Config[`level_${this.index}`];
        this.curTime = this.data.time;

        this.level.string = this.data.title + "";
        this.integral.node.parent.active = this.data.isIntegral;
        // this.integral.string = `${this.allIntegral}分`;

        this.target.node.active = true;
        this.target.node.opacity = 255;
        this.listPanel.active = false;
        this.setTarget(this.data.type);

        this.scheduleOnce(this.switch, 3.5);
    }

    private switch() {
        this.target.node.opacity = 255;
        cc.tween(this.target.node)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.listPanel.active = true;
                this.listPanel.opacity = 0;
                this.setListPanel(this.data.type);

                this.checkTime();

                cc.tween(this.listPanel)
                    .to(0.5, { opacity: 255 })
                    .start();
            })
            .start();
    }

    private checkTime() {
        if (!this.curTime) return;

        this.schedule(this.updateTime, 1, this.curTime, 1);
    }

    private updateTime() {
        this.curTime--;
        this.time.string = this.curTime + "秒";
        if (this.curTime <= 0) {
            this.unschedule(this.updateTime);
            if (this.listPanel.active) {
                this.checkResult();
            }
        }
    }

    private setTarget(type: 1 | 2) {
        let audio = this.index == 0 ? this.audio1_1 : this.audio2_1;
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(audio, false);

        this.rule.string = this.data.rule1;
        this.preTargetIndex = this.getRandom(1, 15, this.preTargetIndex);
        this.target.node.name = this.preTargetIndex + "";
        let imgName: string = type == 1 ? `single_${this.preTargetIndex}` : `many_${this.preTargetIndex}`;
        let path: string = `umbrella/${imgName}`;
        console.log("path : " + path);
        cc.resources.load(path, cc.Texture2D, (err, texture) => {
            this.target.spriteFrame = new cc.SpriteFrame(texture as cc.Texture2D);
        });

        this.curTime = 3;
        this.time.node.parent.active = true;
        this.time.string = `${this.curTime}秒`;
        this.checkTime();
    }

    /**
     * 获取范围内的随机数
     * @param min 最小值
     * @param max 最大值
     * @param haveNum 需要排除的数
     */
    private getRandom(min: number, max: number, haveNum: number): number {
        let random = min + Math.round(Math.random() * (max - min));
        if (random == haveNum) {
            return this.getRandom(min, max, haveNum);
        } else {
            return random;
        }
    }

    private setListPanel(type: 1 | 2) {
        let audio = this.index == 0 ? this.audio1_2 : this.audio2_2;
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(audio, false);

        this.curTime = this.data.time;
        this.time.node.parent.active = this.data.isTime;
        this.time.string = `${this.curTime}秒`;

        this.rule.string = this.data.rule2;
        let layout = this.listPanel.getChildByName("layout").getComponent(cc.Layout);
        let _width: number = (layout.node.width - layout.spacingX * (this.data.raw - 1)) / this.data.raw;
        let _height: number = (layout.node.height - layout.spacingY * (this.data.col - 1)) / this.data.col;
        layout.cellSize = cc.size(_width, _height);

        let randomList = this.getRandomList(this.data.raw * this.data.col);
        console.log("randomList : " + randomList);
        let targetIndex = parseInt(this.target.node.name);
        if (randomList.indexOf(targetIndex) == -1) {
            randomList[Math.floor(Math.random() * (randomList.length - 1))] = targetIndex;
        }

        let correctSan: cc.Node = null;
        layout.node.removeAllChildren();
        for (let i = 0; i < randomList.length; i++) {
            let san = cc.instantiate(this.san).getComponent(cc.Sprite);
            san.node.name = randomList[i] + "";
            layout.node.addChild(san.node);
            let imgName: string = type == 1 ? `single_${randomList[i]}` : `many_${randomList[i]}`;
            let path: string = `umbrella/${imgName}`;
            cc.resources.load(path, cc.Texture2D, (err, texture) => {
                san.spriteFrame = new cc.SpriteFrame(texture as cc.Texture2D);
            });

            if (parseInt(san.node.name) == targetIndex) {
                correctSan = san.node;
            }

            san.node.on("click", this.clickSan, this);
        }
        if (this.index == 0) {
            if (correctSan) {
                this.scheduleOnce(() => {
                    let worldPos: cc.Vec2 = layout.node.convertToWorldSpaceAR(correctSan.getPosition());
                    let localPos: cc.Vec2 = this.node.convertToNodeSpaceAR(worldPos);
                    localPos.x += 30;
                    localPos.y -= 30;
                    this.playHand(localPos);
                }, 0);
            } else {
                this.playHand(cc.v2(54, -175));
            }
        }
    }

    private getRandomList(count: number): number[] {
        let numArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        let newArr: number[] = [];
        for (let i = 0; i < count; i++) {
            let index = Math.floor(Math.random() * numArr.length);
            if (index > numArr.length - 1) {
                index = numArr.length - 1;
            }
            newArr.push(numArr.splice(index, 1)[0]);
        }

        return newArr;
    }

    private clickSan(e: cc.Button) {
        this.stopHand();
        this.unschedule(this.updateTime);
        this.answer = parseInt(e.node.name);
        this.checkResult();
    }

    private checkResult() {
        let correctIndex: number = parseInt(this.target.node.name);
        let str: string = "";
        if (this.answer == correctIndex) { // 答对了
            str = "答对了";
            this.allRightTime += (this.data.time - this.curTime);
            this.curResult.push(true);
            this.curIntegral += this.data.integral;
            if (this.index == 0) { // 练习模式
                this.result.showWin_1();
            } else {
                this.result.showWin_2(this.data.integral);
            }
        } else { // 答错了
            str = "答错了";
            this.curResult.push(false);
            if (this.index == 0) { // 练习模式
                this.result.showLost_1();
            } else { // 难度模式
                this.result.showLost_2();
            }
        }

        let curRightCount = this.curResult.filter(item => item).length;
        console.log(`第 ${this.index} 题 第 ${this.curCount}/${this.data.count} 次玩 共答对${curRightCount}/${this.data.need} ${str} 当前题得分：${this.curIntegral} 总得分：${this.allIntegral}`);
    }

    // 点击弹窗背景
    private clickResultBg() {
        if (this.result.lost_2.active) {
            this.result.node.active = false;
            this.stopHand();
            // this.showView();
            if (this.curCount < this.data.count) { // 还有次数
                this.showView();
            } else { // 最后一次
                let curRightCount = this.curResult.filter(item => item).length;
                if (curRightCount >= this.data.need) { // 虽然最后一次答错了，但是之前答对的次数已经达到过关要求，所以要弹正反馈弹窗
                    this.allIntegral += this.curIntegral;
                    this.curIntegral = 0;
                    this.uploadData.totalScore = this.allIntegral;
                    if (this.index < 4) {
                        this.result.showWin_3();
                        this.setReaction();
                        this.setSuccessCount();
                        this.upload();
                    } else {
                        this.result.showWin_4(this.allIntegral);
                        this.setReaction();
                        this.setSuccessCount();
                        this.upload();
                    }
                } else {
                    this.result.showLost_3();
                }
            }
        } else if (this.result.lost_3.active) {
            this.result.node.active = false;
            this.stopHand();
            this.curCount = 0;
            this.allRightTime = 0;
            this.curResult = [];
            this.curIntegral = 0;
            this.showView();
        } else if (this.result.win_2.active) {
            this.result.node.active = false;
            this.stopHand();
            if (this.curCount < this.data.count) {
                this.showView();
            } else {
                let rightCount = this.curResult.filter(item => item).length;
                if (this.index < 4) {
                    if (rightCount >= this.data.need) {
                        this.allIntegral += this.curIntegral;
                        this.curIntegral = 0;
                        this.uploadData.totalScore = this.allIntegral;
                        this.result.showWin_3();
                        this.setReaction();
                        this.setSuccessCount();
                        this.upload();
                    } else {
                        this.result.showLost_3();
                    }
                } else {
                    if (rightCount >= this.data.need) {
                        this.allIntegral += this.curIntegral;
                        this.curIntegral = 0;
                        this.uploadData.totalScore = this.allIntegral;
                        this.result.showWin_4(this.allIntegral);
                        this.setReaction();
                        this.setSuccessCount();
                        this.upload();
                    } else {
                        this.result.showLost_3();
                    }
                }
            }
        } else if (this.result.win_3.active) {
            this.result.node.active = false;
            this.stopHand();
            this.index++;
            this.uploadData.LevelDifficultyEnd = this.index;
            this.allResult.push(this.curResult);
            this.curCount = 0;
            this.allRightTime = 0;
            this.curResult = [];
            this.curIntegral = 0;
            this.showView();
        }
    }

    // 点击开始游戏
    private clickStartGame() {
        this.result.node.active = false;
        this.index = 1;
        this.uploadData.LevelDifficultyEnd = this.index;
        this.allResult.push(this.curResult);
        this.allIntegral += this.curIntegral;
        this.curIntegral = 0;
        this.uploadData.totalScore = this.allIntegral;
        this.curCount = 0;
        this.allRightTime = 0;
        this.curResult = [];
        this.curIntegral = 0;
        this.showView();
    }

    // 点击再次练习
    private clickTryAgain() {
        this.result.node.active = false;
        this.showView();
    }

    // 点击再玩一次
    private clickReset() {
        this.result.node.active = false;
        this.index = 0;
        this.uploadData.LevelDifficultyEnd = this.index;

        this.init();
    }

    private clickShare() {
        console.log("点击分享按钮");
    }

    private setReaction() {
        let rightCount: number = this.curResult.filter(item => item).length;
        let reaction: number = Math.round(this.allRightTime / rightCount);
        if (this.index == 1) {
            this.uploadData.firstTaskReaction = reaction;
        } else if (this.index == 2) {
            this.uploadData.secondTaskReaction = reaction;
        } else if (this.index == 3) {
            this.uploadData.thirdTaskReaction = reaction;
        } else if (this.index == 4) {
            this.uploadData.fourthTaskReaction = reaction;
        }
    }

    private setSuccessCount() {
        let rightCount: number = this.curResult.filter(item => item).length;
        if (this.index == 1) {
            this.uploadData.firstTaskSuccessCount = rightCount;
        } else if (this.index == 2) {
            this.uploadData.secondTaskSuccessCount = rightCount;
        } else if (this.index == 3) {
            this.uploadData.thirdTaskSuccessCount = rightCount;
        } else if (this.index == 4) {
            this.uploadData.fourthTaskSuccessCount = rightCount;
        }
    }

    private upload() {
        GHttp.instance.upLoadGameData(this.uploadData);
    }

    // update (dt) {}
}
