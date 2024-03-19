extends Control  # Or 'Node2D', based on your root node type

func _ready():
	GameState.set_state(GameState.States.INIT)
	
	if GameState.seed_num == null:
		GameState.seed_num = randi()

	seed(GameState.seed_num)

	print("Game initialized with seed: ", GameState.seed_num)

	$Seed.text = "Seed: " + str(GameState.seed_num)
	
	await get_tree().create_timer(1).timeout
	
	GameState.set_state(GameState.States.DICE_SELECT)
	



	

