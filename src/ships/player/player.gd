extends "res://src/ships/battler.gd"

export(Array, Array, Resource) var deck

onready var zap := load("res://src/cards/details/Zap.tres")
onready var bubble := load("res://src/cards/details/Bubble.tres")

func _ready() -> void:
	generate_starting_deck()

func generate_starting_deck():
	for n in 6:
		if n % 2 == 0:
			deck.append([bubble.duplicate(true)])
		else:
			deck.append([zap.duplicate(true)])

		
func activate_cards(rolls: Array, turn):
	for roll in rolls:
		for card in deck[roll - 1]:
			update_turn_queue(card, turn)
	
