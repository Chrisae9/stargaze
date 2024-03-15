extends GridContainer

var die_scene = preload("res://Die.tscn")
var dice = GameState.dice

func _ready():
	initialize_dice()

func initialize_dice():

	for die in dice:
		var die_instance = die_scene.instantiate()
		die_instance.get_node("Label").text = die.current_roll
		die_instance.get_node("ColorRect").tooltip_text = ", ".join(die.sides)
		add_child(die_instance)
		# Optionally, customize each die instance based on the GameState.dice information
		# For example, if GameState.dice contains values for each die, you can set them here
