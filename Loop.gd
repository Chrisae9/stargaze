extends Control  # Or 'Node2D', based on your root node type

func _ready():
	GameState.connect("state_changed", Callable(self, "_on_state_changed"))
	GameState.current_state = GameState.States.INIT
	
	if GameState.seed_num == null:
		GameState.seed_num = randi()

	seed(GameState.seed_num)

	print("Game initialized with seed: ", GameState.seed_num)

	$DebugInfo/Seed.text = "Seed: " + str(GameState.seed_num)
	
	await get_tree().create_timer(1).timeout
	
	GameState.current_state = GameState.States.DICE_SELECT
	
	

func _on_state_changed(new_state):
	$DebugInfo/State.text = "State: " + str(GameState.States.keys()[new_state])
	if new_state == GameState.States.ROLL:
		roll_dice()
		
		
func roll_dice():
	var dice = GameState.get_dice()
	
	for id in dice:
		var die = dice[id]
		# Check if the die is selected before rolling
		if die.is_selected:
			var roll = die.sides[randi() % die.sides.size()]
			GameState.set_die_property(id, "current_roll", roll)
			
			# Optionally, reset the die's selection status after rolling
			#die["is_selected"] = false
			
	GameState.rolls -= 1
	GameState.current_state = GameState.States.SPLIT_OR_COMBINE

	

