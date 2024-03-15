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
	{'id': 1, 'ability': null},
	{'id': 2, 'ability': null},
	{'id': 3, 'ability': null},
	{'id': 4, 'ability': null},
	{'id': 5, 'ability': null},
	{'id': 6, 'ability': null}
]

# Abilities: Placeholder for the abilities concept, might be filled based on game design.
var abilities = [
	{'name': 'Ability 1', 'description': 'Description of Ability 1'},
	{'name': 'Ability 2', 'description': 'Description of Ability 2'},
	# Add more abilities as per your game design.
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
