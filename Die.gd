extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	$Button.connect("pressed", Callable(self, "_on_select"))
	GameState.connect("state_changed", Callable(self, "_on_state_changed"))

func _on_select():
	var id = get_meta("id")
	
	GameState.dice[id].is_selected = !GameState.dice[id].is_selected

	$ColorRect.color = Color.YELLOW if GameState.dice[id].is_selected else Color.WHITE
	GameState.num_selected_dice += 1 if GameState.dice[id].is_selected else -1
			
	#print("Die ", die_id, " selection toggled to ", die.is_selected)


func _on_state_changed(new_state):
	pass
