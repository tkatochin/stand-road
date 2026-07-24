import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { RoadScene } from './scenes/RoadScene';
import './styles.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 960,
  height: 540,
  backgroundColor: '#17130f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, RoadScene],
};

new Phaser.Game(config);
