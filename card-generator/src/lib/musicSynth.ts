// 基于 Web Audio API 的轻音乐合成器
// 完全离线生成，无网络依赖，无版权问题
// 按风格预设旋律，用钢琴/铃铛音色合成

export interface SynthMusic {
  id: string;
  title: string;
  artist: string;
  duration: number; // 秒
  // 旋律定义：[频率Hz, 起始秒, 持续秒]
  notes: [number, number, number][];
  // 音色
  timbre: "piano" | "bell" | "music_box" | "warm_pad";
  // 节拍速度（秒/拍）
  beat: number;
  loop: boolean;
}

// 频率辅助：C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88
const N = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  C3: 130.81, E3: 164.81, G3: 196.0, A3: 220.0,
  Rest: 0,
};

// 旋律构建辅助：把简谱式序列转成 notes
// 输入：[[音符, 拍数], ...]，beat 为一拍的秒数
function seq(
  notes: [number, number][],
  beat: number,
  startOffset = 0
): [number, number, number][] {
  let t = startOffset;
  return notes.map(([freq, beats]) => {
    const note: [number, number, number] = [freq, t, beats * beat * 0.9]; // 0.9 留一点间隙
    t += beats * beat;
    return note;
  });
}

export const SYNTH_MUSICS: SynthMusic[] = [
  {
    id: "s-quiet",
    title: "Quiet Reflection",
    artist: "卡言合成",
    duration: 16,
    timbre: "piano",
    beat: 0.5,
    loop: true,
    // 宁静沉思：C大调简单旋律
    notes: [
      ...seq([[N.E4, 1], [N.G4, 1], [N.C5, 2], [N.B4, 1], [N.G4, 1], [N.E4, 2]], 0.5),
      ...seq([[N.D4, 1], [N.F4, 1], [N.A4, 2], [N.G4, 1], [N.E4, 1], [N.C4, 2]], 0.5, 4),
      ...seq([[N.C4, 1], [N.E4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2], [N.G4, 2]], 0.5, 8),
      ...seq([[N.A4, 1], [N.F4, 1], [N.E4, 2], [N.D4, 2], [N.C4, 2]], 0.5, 12),
    ],
  },
  {
    id: "s-tender",
    title: "Tenderness",
    artist: "卡言合成",
    duration: 12,
    timbre: "music_box",
    beat: 0.6,
    loop: true,
    // 温柔：八音盒音色，简单摇篮曲风
    notes: [
      ...seq([[N.C4, 1], [N.E4, 1], [N.G4, 1], [N.E4, 1], [N.C4, 1], [N.E4, 1], [N.G4, 1], [N.E4, 1]], 0.6),
      ...seq([[N.F4, 1], [N.A4, 1], [N.C5, 1], [N.A4, 1], [N.F4, 1], [N.A4, 1], [N.C5, 1], [N.A4, 1]], 0.6, 4.8),
    ],
  },
  {
    id: "s-happy",
    title: "Happy Tune",
    artist: "卡言合成",
    duration: 12,
    timbre: "bell",
    beat: 0.4,
    loop: true,
    // 欢快：明亮铃铛，跳跃节奏
    notes: [
      ...seq([[N.G4, 0.5], [N.G4, 0.5], [N.A4, 1], [N.B4, 0.5], [N.A4, 0.5], [N.G4, 1], [N.E4, 1]], 0.4),
      ...seq([[N.G4, 0.5], [N.G4, 0.5], [N.A4, 1], [N.B4, 0.5], [N.C5, 0.5], [N.B4, 1], [N.G4, 1]], 0.4, 4),
      ...seq([[N.C5, 0.5], [N.B4, 0.5], [N.A4, 0.5], [N.G4, 0.5], [N.A4, 0.5], [N.B4, 0.5], [N.C5, 1], [N.G4, 1]], 0.4, 8),
    ],
  },
  {
    id: "s-romantic",
    title: "Romantic",
    artist: "卡言合成",
    duration: 16,
    timbre: "warm_pad",
    beat: 0.8,
    loop: true,
    // 浪漫：温暖铺垫，缓慢
    notes: [
      ...seq([[N.C4, 2], [N.E4, 2], [N.G4, 2], [N.C5, 2]], 0.8),
      ...seq([[N.A4, 2], [N.F4, 2], [N.G4, 2], [N.E4, 2]], 0.8, 6.4),
      ...seq([[N.F4, 2], [N.A4, 2], [N.C5, 2], [N.A4, 2]], 0.8, 12.8),
      ...seq([[N.G4, 2], [N.E4, 2], [N.C4, 4]], 0.8, 19.2),
    ],
  },
  {
    id: "s-festive",
    title: "Festive Bells",
    artist: "卡言合成",
    duration: 10,
    timbre: "bell",
    beat: 0.5,
    loop: true,
    // 节日：钟声跳跃
    notes: [
      ...seq([[N.C5, 1], [N.G4, 0.5], [N.E4, 0.5], [N.G4, 1], [N.C5, 1], [N.G4, 0.5], [N.E4, 0.5], [N.G4, 1]], 0.5),
      ...seq([[N.F4, 1], [N.C5, 0.5], [N.A4, 0.5], [N.C5, 1], [N.B4, 1], [N.G4, 0.5], [N.E4, 0.5], [N.G4, 1]], 0.5, 5),
    ],
  },
  {
    id: "s-gratitude",
    title: "Gratitude",
    artist: "卡言合成",
    duration: 14,
    timbre: "piano",
    beat: 0.7,
    loop: true,
    // 感恩：舒缓钢琴
    notes: [
      ...seq([[N.E4, 1], [N.G4, 1], [N.C5, 2], [N.B4, 1], [N.G4, 1], [N.E4, 2]], 0.7),
      ...seq([[N.F4, 1], [N.A4, 1], [N.C5, 2], [N.B4, 1], [N.A4, 1], [N.G4, 2]], 0.7, 4.2),
      ...seq([[N.A4, 1], [N.G4, 1], [N.E4, 2], [N.D4, 1], [N.E4, 1], [N.C4, 2]], 0.7, 8.4),
    ],
  },
  {
    id: "s-opening",
    title: "Bright Morning",
    artist: "卡言合成",
    duration: 12,
    timbre: "music_box",
    beat: 0.5,
    loop: true,
    // 开业：明亮振奋
    notes: [
      ...seq([[N.C4, 0.5], [N.E4, 0.5], [N.G4, 0.5], [N.C5, 0.5], [N.G4, 0.5], [N.C5, 0.5], [N.E5, 0.5], [N.C5, 0.5]], 0.5),
      ...seq([[N.F4, 0.5], [N.A4, 0.5], [N.C5, 0.5], [N.F5, 0.5], [N.C5, 0.5], [N.F5, 0.5], [N.A5, 0.5], [N.F5, 0.5]], 0.5, 4),
      ...seq([[N.G4, 0.5], [N.B4, 0.5], [N.D5, 0.5], [N.G5, 0.5], [N.D5, 0.5], [N.G5, 0.5], [N.B4, 0.5], [N.G4, 0.5]], 0.5, 8),
    ],
  },
];

// 合成器播放器
export class MusicSynthPlayer {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private timeoutId: number | null = null;
  private currentMusic: SynthMusic | null = null;
  private playing = false;
  private startTime = 0;
  private onEnd?: () => void;

  // 创建音色的振荡器
  private createVoice(
    ctx: AudioContext,
    freq: number,
    start: number,
    dur: number,
    timbre: SynthMusic["timbre"]
  ): { osc: OscillatorNode; gain: GainNode } {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (timbre) {
      case "piano":
        osc.type = "triangle";
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        break;
      case "bell":
        osc.type = "sine";
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 1.5);
        break;
      case "music_box":
        osc.type = "sine";
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.28, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        break;
      case "warm_pad":
        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.1);
        gain.gain.linearRampToValueAtTime(0.1, start + dur - 0.1);
        gain.gain.linearRampToValueAtTime(0, start + dur);
        break;
    }

    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    return { osc, gain };
  }

  play(music: SynthMusic, onEnd?: () => void) {
    this.stop();
    this.currentMusic = music;
    this.onEnd = onEnd;
    this.playing = true;

    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.startTime = this.ctx.currentTime;

    const masterGain = this.ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(this.ctx.destination);

    // 调度所有音符
    music.notes.forEach(([freq, start, dur]) => {
      if (freq <= 0) return;
      const noteStart = this.ctx!.currentTime + start;
      const { osc, gain } = this.createVoice(this.ctx!, freq, noteStart, dur, music.timbre);
      gain.connect(masterGain);
      osc.start(noteStart);
      osc.stop(noteStart + dur + 0.1);
      this.oscillators.push(osc);
      this.gains.push(gain);
    });

    // 循环或结束
    const totalDur = music.duration;
    if (music.loop) {
      this.scheduleLoop(totalDur);
    } else {
      this.timeoutId = window.setTimeout(() => {
        this.playing = false;
        this.onEnd?.();
      }, totalDur * 1000);
    }
  }

  private scheduleLoop(totalDur: number) {
    this.timeoutId = window.setTimeout(() => {
      if (!this.playing || !this.ctx || !this.currentMusic) return;
      // 清理旧音符，重新调度下一轮
      this.cleanupVoices();
      const music = this.currentMusic;
      this.startTime = this.ctx.currentTime;

      const masterGain = this.ctx.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(this.ctx.destination);

      music.notes.forEach(([freq, start, dur]) => {
        if (freq <= 0) return;
        const noteStart = this.ctx!.currentTime + start;
        const { osc, gain } = this.createVoice(this.ctx!, freq, noteStart, dur, music.timbre);
        gain.connect(masterGain);
        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.1);
        this.oscillators.push(osc);
        this.gains.push(gain);
      });

      this.scheduleLoop(totalDur);
    }, totalDur * 1000);
  }

  private cleanupVoices() {
    this.oscillators.forEach((o) => {
      try { o.stop(); } catch { /* 已停止 */ }
      try { o.disconnect(); } catch { /* */ }
    });
    this.gains.forEach((g) => {
      try { g.disconnect(); } catch { /* */ }
    });
    this.oscillators = [];
    this.gains = [];
  }

  stop() {
    this.playing = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.cleanupVoices();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.currentMusic = null;
  }

  isPlaying() {
    return this.playing;
  }
}

// 全局单例播放器
let playerInstance: MusicSynthPlayer | null = null;
export function getPlayer(): MusicSynthPlayer {
  if (!playerInstance) {
    playerInstance = new MusicSynthPlayer();
  }
  return playerInstance;
}

export function findMusic(id: string): SynthMusic | undefined {
  return SYNTH_MUSICS.find((m) => m.id === id);
}
