extends HBoxContainer


# Called when the node enters the scene tree for the first time.
func _ready():
	var slot_scene = preload("res://Slot.tscn")
	for i in range(GameState.slots.size()):
		var slot = slot_scene.instantiate()
		#slot.get_node()
		add_child(slot)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
