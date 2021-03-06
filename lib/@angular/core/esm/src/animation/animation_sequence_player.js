import { isPresent } from '../facade/lang';
import { NoOpAnimationPlayer } from './animation_player';
import { scheduleMicroTask } from '../facade/lang';
export class AnimationSequencePlayer {
    constructor(_players) {
        this._players = _players;
        this._currentIndex = 0;
        this._subscriptions = [];
        this.parentPlayer = null;
        this._players.forEach(player => {
            player.parentPlayer = this;
        });
        this._onNext(false);
    }
    _onNext(start) {
        if (this._players.length == 0) {
            this._activePlayer = new NoOpAnimationPlayer();
            scheduleMicroTask(() => this._onFinish());
        }
        else if (this._currentIndex >= this._players.length) {
            this._activePlayer = new NoOpAnimationPlayer();
            this._onFinish();
        }
        else {
            var player = this._players[this._currentIndex++];
            player.onDone(() => this._onNext(true));
            this._activePlayer = player;
            if (start) {
                player.play();
            }
        }
    }
    _onFinish() {
        if (!isPresent(this.parentPlayer)) {
            this.destroy();
        }
        this._subscriptions.forEach(subscription => subscription());
        this._subscriptions = [];
    }
    onDone(fn) { this._subscriptions.push(fn); }
    play() { this._activePlayer.play(); }
    pause() { this._activePlayer.pause(); }
    restart() {
        if (this._players.length > 0) {
            this.reset();
            this._players[0].restart();
        }
    }
    reset() { this._players.forEach(player => player.reset()); }
    finish() { this._players.forEach(player => player.finish()); }
    destroy() { this._players.forEach(player => player.destroy()); }
    setPosition(p) {
        this._players[0].setPosition(p);
    }
    getPosition() {
        return this._players[0].getPosition();
    }
}
//# sourceMappingURL=animation_sequence_player.js.map