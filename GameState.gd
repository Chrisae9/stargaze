# GameState.gd
extends Node

#var seed = null
var seed_num = 2667839505

enum States {
	INIT, # Initialization before the game starts, loading resources, setting up the game world.
	START, # The beginning of the game after initialization.
	DICE_SELECT, # Player selects which dice to use.
	ROLL, # The action of rolling the dice.
	SPLIT_OR_COMBINE, # Decide whether to split or combine dice results.
	CALC_CHARGE, # Calculate the charge based on dice outcomes.
	CALC_OVERCLOCK, # Calculate the overclock value.
	CALC_SCRAP, # Calculate the scrap collected.
	CALC_MODIFIER, # Apply any modifiers to the calculations.
	CHUNK_SELECT, # Selecting chunks of resources or targets.
	TOTAL, # Summarize total gains/losses for the turn or action.
	DESTROY, # Handle the destruction of chunks or entities.
	LOOP, # Reset the state for a new round or action.
	INVENTORY, # Managing inventory or equipment.
	SETTINGS, # Adjusting game settings or preferences.
	PAUSE, # Game is paused.
	VICTORY, # Condition for winning the game.
	LOSS, # Condition for losing the game.
	END # Concluding the game session.
}

var current_state = null:
	get:
		return current_state
	set(new_state):
		emit_signal("state_changed", new_state)
		current_state = new_state

signal state_changed(new_state)

# Define a signal that will be emitted when a die's property changes.
signal dice_changed(die_id, property_name, new_value)

signal compute_dice(action, value)


var total_rolls = 3

signal roll_used(rolls_left)

var rolls = total_rolls:
	get:
		return rolls
	set(rolls_left):
		emit_signal("roll_used", rolls_left)
		rolls=rolls_left



# Private storage for dice.
var _dice = {
	1: {'sides': [1, 2, 3], 'current_roll': 3, 'is_selected': false},
	2: {'sides': [1, 2, 3], 'current_roll': 2, 'is_selected': false},
}

func get_dice_split() -> Array:
	var selected_rolls = []
	for id in _dice:
		if _dice[id].is_selected:
			selected_rolls.append(_dice[id].current_roll)
	emit_signal("compute_dice", "split", selected_rolls)
	return selected_rolls


func get_dice_combine():
	var total_roll = 0
	for id in _dice:
		if _dice[id].is_selected:
			total_roll += _dice[id].current_roll
	emit_signal("compute_dice", "combine", total_roll)
	return total_roll


# Public method to access dice dictionary. Acts as a getter.
func get_dice() -> Dictionary:
	return _dice

# Method to update properties of a die by its id.
# This method allows updating individual properties and emits the `dice_changed` signal.
func set_die_property(die_id: int, property: String, value) -> void:
	if _dice.has(die_id) and _dice[die_id].has(property):
		_dice[die_id][property] = value
		emit_signal("dice_changed", die_id, property, value)
	else:
		print("Die ID or property name is invalid.")
		

func get_num_selected_dice() -> int:
	var count = 0
	for die in _dice.values():
		if die['is_selected']:
			count += 1
	return count

# Comet setup: Start with three chunks of different masses.
var comet = {
	'mass_chunks': [100, 120, 150]
}

# Slots setup: Assuming a basic structure, further details depend on game mechanics.
var slots = [
	{'id': 1, 'primary_ability': 1, 'secondary_abilities': [7, 8]},
	{'id': 2, 'primary_ability': 2, 'secondary_abilities': [8, 9]},
	{'id': 3, 'primary_ability': 3, 'secondary_abilities': [9, 10]},
	{'id': 4, 'primary_ability': 4, 'secondary_abilities': [10, 11]},
	{'id': 5, 'primary_ability': 5, 'secondary_abilities': [11, 12]},
	{'id': 6, 'primary_ability': 6, 'secondary_abilities': [12, 13]}
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



