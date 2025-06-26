export interface EnemyCard {
  name: string;
  points: number;
  score: number;
}

export class EnemyBoard {
  slots: (EnemyCard | null)[] = Array(7).fill(null); // 1-based, 6 slots

  initialize() {
    // For now, just fill with dummy enemy cards
    for (let i = 1; i <= 6; i++) {
      this.slots[i] = {
        name: `Enemy ${i}`,
        points: i,
        score: 0,
      };
    }
  }

  /**
   * Increment the score for an enemy slot.
   * @param slot The slot number (1-based)
   * @param amount The amount to increment
   * @throws If the slot is empty
   */
  incrementScore(slot: number, amount: number) {
    const enemy = this.slots[slot];
    if (!enemy) throw new Error('No enemy in this slot');
    enemy.score += amount;
  }
}
