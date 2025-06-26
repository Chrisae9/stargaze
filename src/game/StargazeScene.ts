/**
 * @fileoverview
 * Minimal Phaser 3 scene for Stargaze: displays 8 sector slots, dice, roll/split/combine buttons, and card stacks for user testing.
 * Uses core logic from StargazeCore.ts.
 */
import Phaser from 'phaser';
import {
  createInitialPlayerState,
  rollD4,
  activateSlots,
  addCardToSlot,
  SECTORS,
  PlayerState,
  SectorSlot,
} from './StargazeCore';

/**
 * @class StargazeScene
 * @classdesc Minimal UI for Stargaze core gameplay loop for user testing.
 */
export class StargazeScene extends Phaser.Scene {
  player: PlayerState;
  dice: [number, number] = [1, 1];
  mode: 'split' | 'combine' = 'split';
  diceText?: Phaser.GameObjects.Text[];
  slotCards: Phaser.GameObjects.Container[] = [];
  rollButton?: Phaser.GameObjects.Text;
  splitButton?: Phaser.GameObjects.Text;
  combineButton?: Phaser.GameObjects.Text;

  constructor() {
    super('StargazeScene');
    this.player = createInitialPlayerState();
  }

  preload() {}

  create() {
    // Debug indicator for testing scene load
    console.log('StargazeScene create running');
    this.add.text(300, 20, 'SCENE LOADED', {
      fontFamily: 'Roboto',
      fontSize: '32px',
      color: '#ffe600',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    });
    this.add.text(40, 60, 'Stargaze: Minimal Test UI', {
      fontFamily: 'Roboto',
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    });
    // Draw sector slots with improved spacing
    for (let i = 0; i < 8; i++) {
      const y = 110 + i * 60;
      this.add.text(40, y, `${i + 1}. ${SECTORS[i]}`, {
        fontFamily: 'Roboto',
        fontSize: '18px',
        color: '#b0b0ff',
        fontStyle: 'bold',
      });
      // Card stack container
      const slot = this.player.slots[i];
      const container = this.add.container(260, y + 10);
      // Active card
      const active = this.add.rectangle(0, 0, 120, 48, 0x2222aa).setStrokeStyle(2, 0xffffff);
      const activeText = this.add.text(-54, -16, slot.active.name, {
        fontFamily: 'Roboto',
        fontSize: '16px',
        color: '#fff',
        fontStyle: 'bold',
      });
      container.add([active, activeText]);
      // Passive cards (stacked behind, with readable text)
      slot.passive.forEach((card, j) => {
        const passive = this.add.rectangle(-30 - j * 16, 18 + j * 10, 100, 38, 0x444444).setAngle(180);
        // Text is NOT rotated and is centered on the card for readability
        const passiveText = this.add.text(-30 - j * 16, 18 + j * 10, card.name, {
          fontFamily: 'Roboto',
          fontSize: '13px',
          color: '#bbb',
          fontStyle: 'bold',
        }).setOrigin(0.5);
        container.add([passive, passiveText]);
      });
      this.slotCards.push(container);
    }
    // Dice display
    this.diceText = [
      this.add.text(500, 120, `Die 1: ${this.dice[0]}`, {
        fontFamily: 'Roboto',
        fontSize: '20px',
        color: '#fff',
        fontStyle: 'bold',
      }),
      this.add.text(500, 160, `Die 2: ${this.dice[1]}`, {
        fontFamily: 'Roboto',
        fontSize: '20px',
        color: '#fff',
        fontStyle: 'bold',
      }),
    ];
    // Roll button
    this.rollButton = this.add.text(500, 220, 'Roll Dice', {
      fontFamily: 'Roboto',
      fontSize: '20px',
      backgroundColor: '#333',
      color: '#fff',
      padding: { x: 16, y: 8 },
      fontStyle: 'bold',
    })
      .setInteractive()
      .on('pointerdown', () => this.handleRoll());
    // Split/combine buttons
    this.splitButton = this.add.text(500, 270, 'Split', {
      fontFamily: 'Roboto',
      fontSize: '18px',
      backgroundColor: '#222',
      color: '#fff',
      padding: { x: 12, y: 6 },
      fontStyle: 'bold',
    })
      .setInteractive()
      .on('pointerdown', () => this.setMode('split'));
    this.combineButton = this.add.text(590, 270, 'Combine', {
      fontFamily: 'Roboto',
      fontSize: '18px',
      backgroundColor: '#222',
      color: '#fff',
      padding: { x: 12, y: 6 },
      fontStyle: 'bold',
    })
      .setInteractive()
      .on('pointerdown', () => this.setMode('combine'));
    this.updateModeButtons();
  }

  handleRoll() {
    this.dice = [rollD4(), rollD4()];
    this.diceText?.[0].setText(`Die 1: ${this.dice[0]}`);
    this.diceText?.[1].setText(`Die 2: ${this.dice[1]}`);
    // Highlight activated slots
    const indices = activateSlots(this.player, this.dice, this.mode);
    this.slotCards.forEach((container, i) => {
      container.setAlpha(indices.includes(i) ? 1 : 0.5);
    });
  }

  setMode(mode: 'split' | 'combine') {
    this.mode = mode;
    this.updateModeButtons();
    // Optionally update slot highlights
    this.handleRoll();
  }

  updateModeButtons() {
    if (this.splitButton) this.splitButton.setBackgroundColor(this.mode === 'split' ? '#555' : '#222');
    if (this.combineButton) this.combineButton.setBackgroundColor(this.mode === 'combine' ? '#555' : '#222');
  }
}
