export default class SoundNotify {
    static _instance;

    static getInstance() {
        if (SoundNotify._instance) {
            return SoundNotify._instance;
        }

        SoundNotify._instance = new SoundNotify();
        return this._instance;
    }

    constructor() {
        if (SoundNotify._instance) {
            return SoundNotify._instance;
        }

        SoundNotify._instance = this;
    }

    playCritical() {
                const audio = new Audio('/critical_sound.wav');
        audio.play();
    }

}

