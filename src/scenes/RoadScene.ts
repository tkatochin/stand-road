import Phaser from 'phaser';
import {
  advanceRoad,
  createRoadProgress,
  type RoadProgress,
} from '../game/road';

const COLORS = {
  ink: 0x17130f,
  paper: '#f4e7c1',
  gold: 0xe2b95f,
  road: 0x332a28,
  roadEdge: 0xd2a85b,
  dusk: 0x31203d,
};

export class RoadScene extends Phaser.Scene {
  private progress: RoadProgress = createRoadProgress();
  private scenery!: Phaser.GameObjects.Container;
  private traveler!: Phaser.GameObjects.Container;
  private distanceText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private cardsText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Rectangle;
  private messageText!: Phaser.GameObjects.Text;
  private advanceButton!: Phaser.GameObjects.Container;
  private isAnimating = false;

  constructor() {
    super('RoadScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.dusk);
    this.drawWorld();
    this.createHud();
    this.createAdvanceButton();
    this.createKeyboardInput();
    this.updateHud();

    this.cameras.main.fadeIn(450, 23, 19, 15);
  }

  private drawWorld() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();

    graphics.fillGradientStyle(0x2c1b36, 0x2c1b36, 0xa85f4b, 0xa85f4b, 1);
    graphics.fillRect(0, 0, width, height);

    graphics.fillStyle(0xe5a35f, 0.9);
    graphics.fillCircle(width * 0.76, 130, 58);
    graphics.fillStyle(0x35213a, 1);
    graphics.fillTriangle(0, 330, 250, 118, 470, 330);
    graphics.fillStyle(0x472a3d, 1);
    graphics.fillTriangle(300, 330, 580, 145, 840, 330);
    graphics.fillStyle(0x2a2032, 1);
    graphics.fillTriangle(620, 330, 850, 185, width + 80, 330);

    graphics.fillStyle(0x493a2f, 1);
    graphics.fillRect(0, 310, width, height - 310);
    graphics.fillStyle(COLORS.road, 1);
    graphics.fillTriangle(width / 2 - 55, 280, width / 2 - 330, height, width / 2 + 330, height);
    graphics.lineStyle(4, COLORS.roadEdge, 0.8);
    graphics.lineBetween(width / 2 - 55, 280, width / 2 - 330, height);
    graphics.lineBetween(width / 2 + 55, 280, width / 2 + 330, height);

    this.scenery = this.add.container(0, 0);
    for (let index = 0; index < 10; index += 1) {
      const y = 305 + index * 29;
      const spread = (y - 270) * 0.72;
      const marker = this.add.rectangle(
        width / 2 + (index % 2 === 0 ? -spread : spread),
        y,
        34 + index * 3,
        4,
        COLORS.gold,
        0.65,
      );
      this.scenery.add(marker);
    }

    this.traveler = this.add.container(width / 2, 392);
    const shadow = this.add.ellipse(0, 67, 70, 18, COLORS.ink, 0.35);
    const cloak = this.add.triangle(0, 34, 0, 54, 30, -30, -30, -30, 0x13111a);
    const head = this.add.circle(0, -14, 14, 0xe8c59d);
    const hat = this.add.rectangle(0, -30, 56, 8, COLORS.ink);
    const crown = this.add.rectangle(0, -39, 31, 18, COLORS.ink);
    this.traveler.add([shadow, cloak, head, hat, crown]);
  }

  private createHud() {
    const panel = this.add.rectangle(24, 22, 912, 78, COLORS.ink, 0.8).setOrigin(0);
    panel.setStrokeStyle(2, COLORS.gold, 0.7);

    this.add.text(46, 36, 'STAND ROAD', {
      fontFamily: 'Georgia, serif',
      fontSize: '25px',
      fontStyle: 'bold',
      color: COLORS.paper,
    });
    this.stageText = this.add.text(316, 39, '', this.hudTextStyle());
    this.distanceText = this.add.text(485, 39, '', this.hudTextStyle());
    this.cardsText = this.add.text(750, 39, '', this.hudTextStyle());

    this.add.rectangle(485, 82, 330, 8, 0x0c0b0b, 0.8).setOrigin(0, 0.5);
    this.progressBar = this.add.rectangle(485, 82, 0, 8, COLORS.gold, 1).setOrigin(0, 0.5);

    this.messageText = this.add
      .text(this.scale.width / 2, 127, '夕暮れの一本道。まだ見ぬスタンド使いが待っている。', {
        fontFamily: 'Georgia, serif',
        fontSize: '19px',
        color: '#fff1cf',
        backgroundColor: 'rgba(23, 19, 15, 0.72)',
        padding: { x: 18, y: 10 },
        align: 'center',
      })
      .setOrigin(0.5);
  }

  private createAdvanceButton() {
    const { width, height } = this.scale;
    const button = this.add.rectangle(0, 0, 230, 64, 0x17130f, 0.92);
    button.setStrokeStyle(3, COLORS.gold, 1);
    const label = this.add
      .text(0, 0, '進む  ▶', {
        fontFamily: 'Georgia, serif',
        fontSize: '27px',
        fontStyle: 'bold',
        color: COLORS.paper,
      })
      .setOrigin(0.5);

    this.advanceButton = this.add.container(width / 2, height - 56, [button, label]);
    button
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        button.setFillStyle(0x4d3424, 1);
        this.advanceButton.setScale(1.03);
      })
      .on('pointerout', () => {
        button.setFillStyle(0x17130f, 0.92);
        this.advanceButton.setScale(1);
      })
      .on('pointerdown', () => this.handleAdvance());
  }

  private createKeyboardInput() {
    this.input.keyboard?.on('keydown-SPACE', () => this.handleAdvance());
    this.input.keyboard?.on('keydown-RIGHT', () => this.handleAdvance());
    this.input.keyboard?.on('keydown-ENTER', () => this.handleAdvance());
  }

  private handleAdvance() {
    if (this.isAnimating) {
      return;
    }

    if (this.progress.completed) {
      this.restartJourney();
      return;
    }

    const result = advanceRoad(this.progress);
    this.progress = result.progress;
    this.isAnimating = true;

    this.tweens.add({
      targets: this.scenery.list,
      y: '+=18',
      duration: 220,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.traveler,
      y: '-=12',
      duration: 150,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.isAnimating = false;
      },
    });

    if (result.reachedGoal) {
      this.showGoal();
    } else if (result.encountered) {
      this.showEncounter();
    } else {
      this.messageText.setText(this.progressMessage());
    }

    this.updateHud();
  }

  private showEncounter() {
    this.cameras.main.flash(260, 226, 185, 95, false);
    this.messageText.setText(
      `スタンド使いと遭遇！ 記憶のカードを獲得した。\nカード ${this.progress.acquiredCards}枚目`,
    );
  }

  private showGoal() {
    this.cameras.main.flash(500, 244, 231, 193, false);
    this.messageText.setText(
      `ROAD COMPLETE — ${this.progress.distance}m を踏破した。\n獲得カード ${this.progress.acquiredCards}枚`,
    );
    const label = this.advanceButton.getAt<Phaser.GameObjects.Text>(1);
    label.setText('もう一度歩く');
  }

  private restartJourney() {
    this.progress = createRoadProgress();
    const label = this.advanceButton.getAt<Phaser.GameObjects.Text>(1);
    label.setText('進む  ▶');
    this.messageText.setText('新しい旅が始まる。一本道の先へ。');
    this.updateHud();
  }

  private updateHud() {
    this.stageText.setText(`STAGE ${this.progress.stage}`);
    this.distanceText.setText(
      `${this.progress.distance} / ${this.progress.goalDistance} m`,
    );
    this.cardsText.setText(`CARDS  ${this.progress.acquiredCards}`);
    this.progressBar.width =
      330 * (this.progress.distance / this.progress.goalDistance);
  }

  private progressMessage() {
    const remaining = this.progress.nextEncounterDistance - this.progress.distance;
    return remaining > 0
      ? `風が道を横切る。次の気配まで、あと ${remaining}m。`
      : '道の先に、何者かの気配がする。';
  }

  private hudTextStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'Georgia, serif',
      fontSize: '19px',
      color: COLORS.paper,
    };
  }
}
