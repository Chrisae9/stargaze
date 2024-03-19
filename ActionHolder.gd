extends HBoxContainer


# Called when the node enters the scene tree for the first time.
func _ready():
	GameState.connect("state_changed", Callable(self, "_on_state_changed"))
	GameState.connect("dice_selection_changed", Callable(self, "update_roll"))

func _on_state_changed(new_state):
	#$Roll.disabled = !GameState.num_selected_dice == 0
	$Split.disabled = new_state != GameState.States.SPLIT_OR_COMBINE
	$Combine.disabled = new_state != GameState.States.SPLIT_OR_COMBINE

func update_roll(num_selected_dice):
	$Roll.disabled = num_selected_dice == 0
