extends GridContainer

var die_scene = preload("res://Die.tscn")


func _ready():
	GameState.connect("state_changed", Callable(self, "_on_state_changed"))

func _on_state_changed(new_state):
	if new_state == GameState.States.DICE_SELECT:
		initialize_dice()

func initialize_dice():
	
	var dice = GameState.get_dice()

	for id in dice:
		var die_instance = die_scene.instantiate()
		
		die_instance.set_meta("id", id)
		die_instance.get_node("Label").text = str(dice[id].current_roll)
		die_instance.get_node("Button").tooltip_text = ", ".join(dice[id].sides)
		
		add_child(die_instance)
		
func update_dice():
	pass
