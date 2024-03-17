extends HBoxContainer


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	$Roll.disabled = GameState.current_state != GameState.States.ROLL
	$Split.disabled = GameState.current_state != GameState.States.SPLIT_OR_COMBINE
	$Combine.disabled = GameState.current_state != GameState.States.SPLIT_OR_COMBINE
