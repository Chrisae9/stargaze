extends HBoxContainer

# Called when the node enters the scene tree for the first time.
func _ready():
	GameState.connect("state_changed", Callable(self, "_on_state_changed"))
	GameState.connect("dice_changed", Callable(self, "update_roll"))
	GameState.connect("roll_used", Callable(self, "update_roll_text"))
	$Roll.connect("pressed", Callable(self, "_on_roll_select"))
	$Split
	$Roll.text = "Rolls (" + str(GameState.rolls) +  ")"
	

func _on_state_changed(new_state):
	$Split.disabled = new_state != GameState.States.SPLIT_OR_COMBINE
	$Combine.disabled = new_state != GameState.States.SPLIT_OR_COMBINE

func update_roll(_id, property, _value):
	if property == "is_selected" and GameState.current_state == GameState.States.DICE_SELECT:
		$Roll.disabled = GameState.get_num_selected_dice() == 0 and GameState.rolls > 0
	else:
		$Roll.disabled = true
		
func update_roll_text(rolls_left):
	$Roll.text = "Rolls (" + str(rolls_left) +  ")"

func _on_roll_select():
	GameState.current_state = GameState.States.ROLL
