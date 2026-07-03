import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 28, 'STAND ROAD', {
        fontFamily: 'Georgia, serif',
        fontSize: '56px',
        color: '#f3df9d',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 34, 'Phaser 3 + Vite ready', {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#d8d1c2',
      })
      .setOrigin(0.5);
  }
}
