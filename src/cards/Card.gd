extends Control

var current_slot : int

export(Resource) var details


func _ready() -> void:
	$MarginContainer/VBoxContainer/Name.text = details.card_name
	$MarginContainer/VBoxContainer/Description.text = details.description
	$MarginContainer/VBoxContainer/HBoxContainer/Cost.text = "$" + str(details.cost)
	$MarginContainer/VBoxContainer/HBoxContainer/Durability.text = "(" + str(details.durability) + ")"
	
	var type_text : PoolStringArray
	
	for type in details.types:
		type_text.append(details.Type.keys()[type])
		
	$MarginContainer/VBoxContainer/Types.text = type_text.join(", ")
	$MarginContainer/VBoxContainer/Rarity.text = details.Rarity.keys()[details.rarity]
	


