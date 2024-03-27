extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	$Button.connect("pressed", Callable(self, "_on_select"))
	GameState.connect("dice_changed", Callable(self, "update_dice"))

func _on_select():
	var id = get_meta("id")
	var die = GameState.get_dice()[id]
	
	GameState.set_die_property(id, "is_selected", !die.is_selected)

func update_dice(id, _property, _value):
	if get_meta("id") == id:
		var die = GameState.get_dice()[id]
		$Label.text = str(die.current_roll)
		$Button.tooltip_text = ", ".join(die.sides)
		$ColorRect.color = Color.YELLOW if die.is_selected else Color.WHITE
