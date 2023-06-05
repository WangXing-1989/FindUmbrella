import Main from "./Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Node)
    lost_1: cc.Node = null;

    @property(cc.Node)
    lost_2: cc.Node = null;

    @property(cc.Node)
    lost_3: cc.Node = null;

    @property(cc.Node)
    win_1: cc.Node = null;

    @property(cc.Node)
    win_2: cc.Node = null;

    @property(cc.Node)
    win_3: cc.Node = null;
    
    @property(cc.Node)
    win_4: cc.Node = null;
    
    @property(cc.Node)
    timeOut: cc.Node = null;

    private main: Main;

    start() {
        this.main = cc.find("Canvas").getComponent(Main);
        this.node.active = false;
        this.hideAllDialog();
    }

    public showLost_1() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioWrong, false);
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.lost_1);
        this.main.stopHand();
    }

    public showLost_2() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioWrong, false);
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.lost_2);
        this.main.playHand();
    }

    public showLost_3() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioFail, false);
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.lost_3);
        this.main.playHand();
    }

    public showWin_1() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioRight, false);
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.win_1);
    }

    public showWin_2(integral: number) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioRight, false);
        this.node.active = true;

        let label = cc.find("panel/label2", this.win_2).getComponent(cc.Label);
        label.string = "+" + integral;

        this.hideAllDialog();
        this.playShow(this.win_2);
        this.main.playHand();
    }

    public showWin_3() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioSuccess, false);
        this.node.active = true;
        this.hideAllDialog();
        this.playShow(this.win_3);
        this.main.playHand();
    }

    public showWin_4(integral: number) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioSuccess, false);
        this.node.active = true;

        let label = cc.find("panel/layout/label1", this.win_4).getComponent(cc.Label);
        label.string = "" + integral;

        this.hideAllDialog();
        this.playShow(this.win_4);
        this.main.stopHand();
    }

    public showTimeOut(integral: number) {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playEffect(this.main.audioFail, false);
        this.node.active = true;

        let label = cc.find("panel/layout/label1", this.timeOut).getComponent(cc.Label);
        label.string = "" + integral;

        this.hideAllDialog();
        this.playShow(this.timeOut);
        this.main.stopHand();
    }

    private playShow(dialog: cc.Node) {
        dialog.active = true;
        dialog.scale = 0;
        cc.tween(dialog).to(0.5, {scale: 1}, { easing: 'elasticOut'}).start();
    }

    private playHide(dialog: cc.Node) {
        dialog.scale = 1;
        cc.tween(dialog).to(0.5, {scale: 0}, { easing: 'elasticIn'}).call(() => dialog.active = false).start();
    }

    public hideAllDialog() {
        this.lost_1.active = false;
        this.lost_2.active = false;
        this.lost_3.active = false;
        this.win_1.active = false;
        this.win_2.active = false;
        this.win_3.active = false;
        this.win_4.active = false;
        this.timeOut.active = false;
    }
}
