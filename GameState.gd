# GameState.gd
extends Node

# Dice setup: Two dice, each with three sides.
var dice = [
	{'sides': [1, 2, 3], 'current_roll': "3"},
	{'sides': [1, 2, 3], 'current_roll': "3"}
]

# Comet setup: Start with three chunks of different masses.
var comet = {
	'mass_chunks': [100, 120, 150]
}

# Slots setup: Assuming a basic structure, further details depend on game mechanics.
var slots = [
	{'id': 1, 'ability': 1},
	{'id': 2, 'ability': 2},
	{'id': 3, 'ability': 3},
	{'id': 4, 'ability': 4},
	{'id': 5, 'ability': 5},
	{'id': 6, 'ability': 6}
]

var abilities = [
	{'name': 'Galactic Surge', 'active': [50, 1, 25], 'passive': [30, 2, 20]},
	{'name': 'Meteor Shower', 'active': [60, 2, 30], 'passive': [45, 1, 25]},
	{'name': 'Void Rift', 'active': [70, 1, 20], 'passive': [50, 3, 15]},
	{'name': 'Solar Flare', 'active': [55, 2, 35], 'passive': [40, 2, 30]},
	{'name': 'Starlight Veil', 'active': [40, 1, 40], 'passive': [35, 2, 25]},
	{'name': 'Nebula Pulse', 'active': [65, 3, 15], 'passive': [55, 1, 20]},
	{'name': 'Cosmic Ray', 'active': [80, 2, 50], 'passive': [60, 2, 40]},
	{'name': 'Asteroid Belt', 'active': [45, 2, 20], 'passive': [35, 1, 15]},
	{'name': 'Gravity Well', 'active': [50, 1, 30], 'passive': [40, 2, 25]},
	{'name': 'Photon Burst', 'active': [30, 3, 25], 'passive': [20, 2, 20]},
	{'name': 'Quantum Leap', 'active': [75, 2, 45], 'passive': [65, 1, 35]},
	{'name': 'Orbital Strike', 'active': [85, 3, 55], 'passive': [70, 2, 50]},
	{'name': 'Lunar Lance', 'active': [60, 1, 40], 'passive': [45, 3, 30]},
	{'name': 'Supernova Flash', 'active': [90, 3, 60], 'passive': [80, 1, 55]},
	{'name': 'Black Hole Bind', 'active': [95, 2, 70], 'passive': [85, 3, 65]},
	{'name': 'Stellar Wind', 'active': [55, 1, 35], 'passive': [50, 2, 30]},
	{'name': 'Comet Tail', 'active': [65, 2, 45], 'passive': [60, 1, 40]},
	{'name': 'Galaxy Guard', 'active': [75, 3, 50], 'passive': [70, 2, 45]}
]

func _ready():
	randomize()  # Ensure random results are different each run

func roll_dice():
	for die in dice:
		die.current_roll = die.sides[randi() % die.sides.size()]
	# Emit signal or call function to update game state based on dice roll.

func reset_dice():
	for die in dice:
		die.current_roll = null
	# Additional reset logic as needed.
