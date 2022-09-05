extends Control

onready var slots : Array

onready var card_holder := $MarginContainer2/CardHolder

signal activate_card

onready var placeholders := {
	1: $MarginContainer/HBoxContainer/Slot1,
	2: $MarginContainer/HBoxContainer/Slot2,
	3: $MarginContainer/HBoxContainer/Slot3,
	4: $MarginContainer/HBoxContainer/Slot4,
	5: $MarginContainer/HBoxContainer/Slot5,
	6: $MarginContainer/HBoxContainer/Slot6
}
		
func reset_color():
	for placeholder in placeholders.values():
		placeholder.color = Color(1, 1, 1)
		
func activate_slots(type, rolls : Array):
	for roll in rolls:
		if placeholders.has(roll):
			placeholders[roll].color = Color(0.196078, 1, 0)
	activate_cards(type, rolls)
			
func activate_cards(type, rolls: Array):
	var selected_cards : Array = []
	for roll in rolls:
		selected_cards.append_array(slots[roll - 1])
		#selected_cards.sort_custom()
	for card in selected_cards:
		emit_signal("activate_card", card)
			
func setup_slots(player):
	slots = player.deck
	refresh_cards()
	
func refresh_cards():
	
	for n in card_holder.get_children():
		n.queue_free()
	
	for slot in slots:
		var vbox : VBoxContainer = VBoxContainer.new()
		vbox.add_constant_override("separation", -170)
		card_holder.add_child(vbox)
		for resource in slot:
			var card := preload("res://src/cards/Card.tscn").instance()
			card.details = resource
			vbox.add_child(card)
