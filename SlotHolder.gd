extends HBoxContainer

# Define colors for active and passive abilities
var active_colors = {
	'Charge': Color(0.0, 1.0, 0.2), # Vibrant Electric Green
	'Overclock': Color(0.0, 0.5, 1.0), # Vibrant Blue
	'Scrap': Color(0.7, 0.7, 0.7) # Light Gray
}

var passive_colors = {
	'Charge': Color(0.0, 0.4, 0.0), # Dark Green
	'Overclock': Color(0.0, 0.0, 0.4), # Dark Blue
	'Scrap': Color(0.3, 0.3, 0.3) # Dark Gray
}

# Called when the node enters the scene tree for the first time.
func _ready():
	var slot_scene = preload("res://Slot.tscn")
	var ability_scene = preload("res://Ability.tscn")
	
	for i in range(GameState.slots.size()):
		var slot_instance = slot_scene.instantiate()
		slot_instance.get_node("SlotNumber").text = str(i + 1)
		
		# Secondary Abilities (using 'passive')
		for secondary_ability_number in GameState.slots[i]["secondary_abilities"]:
			var secondary_ability_instance = ability_scene.instantiate()
			_populate_ability(secondary_ability_instance, secondary_ability_number, false) # false for passive
			slot_instance.get_node("Abilities").add_child(secondary_ability_instance)
		
		# Primary Ability (using 'active')
		var primary_ability_instance = ability_scene.instantiate()
		var primary_ability_number = GameState.slots[i]["primary_ability"]
		_populate_ability(primary_ability_instance, primary_ability_number, true) # true for active
		slot_instance.get_node("Abilities").add_child(primary_ability_instance)
		
		add_child(slot_instance)

# Helper function to populate ability details
# `use_active` determines whether to use 'active' or 'passive' stats
func _populate_ability(ability_instance, ability_number, use_active):
	var ability = GameState.abilities[ability_number - 1] # Assuming abilities are 0-indexed in the list
	
	var stats = ability["active"] if use_active else ability["passive"]
	var colors = active_colors if use_active else passive_colors
	
	var charge = stats[0]
	var overclock = stats[1]
	var scrap = stats[2]
	
	ability_instance.get_node("HBoxContainer/Charge/Label").text = str(charge)
	ability_instance.get_node("HBoxContainer/Overclock/Label").text = str(overclock)
	ability_instance.get_node("HBoxContainer/Scrap/Label").text = str(scrap)
	
	# Set ColorRect colors
	ability_instance.get_node("HBoxContainer/Charge/ColorRect").color = colors['Charge']
	ability_instance.get_node("HBoxContainer/Overclock/ColorRect").color = colors['Overclock']
	ability_instance.get_node("HBoxContainer/Scrap/ColorRect").color = colors['Scrap']
