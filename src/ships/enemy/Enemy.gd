extends "res://src/ships/battler.gd"

export(Array, Resource) var moveset

onready var move := $Move
	
func move(turn):
	var move_details : Resource = moveset[(turn - 1) % moveset.size()]
	update_turn_queue(move_details, turn)
	#var next_move_details : Resource = moveset[(turn) % moveset.size()]
	#move.update_move(next_move_details)
	move.update_move(move_details)
	
	

	
