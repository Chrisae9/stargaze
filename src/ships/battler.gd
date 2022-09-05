extends Node2D

signal death

export(int) var max_health

export(int) var current_health

onready var health_label := $Health
onready var block_label := $Block

var block : int 

var reset_block := true

var turn_queue : Dictionary = {}


func _ready() -> void:
	update_health_label()
	
func heal(amount):
	current_health = min(current_health + amount, max_health)
	update_health_label()
	
func take_raw_damage(damage):
	current_health = max(0, current_health - damage)
	update_health_label()

func take_damage(damage):
	var remaining_damage := lose_block(damage)
	current_health = max(0, current_health - remaining_damage)
	update_health_label()
	if current_health == 0:
		emit_signal("death")


func update_health_label():
	health_label.text = "Health: " + str(current_health) + "/" + str(max_health)

func update_block_label():
	block_label.text = "Block: " + str(block)
	
func gain_block(amount):
	block += amount
	update_block_label()

func lose_block(amount) -> int:
	var remainder : int = abs(min(block - amount, 0))
	block = max(0, block - amount)
	update_block_label()
	
	return remainder
	
func reset_block():
	if reset_block:
		block = 0
		update_block_label()
		
func update_turn_queue(details: Resource, turn):
	for effect in details.effects:
		for duration in effect.duration:
			register_effect(effect, turn + duration)
						
func register_effect(effect, turn):
	if !turn_queue.has(turn):
		turn_queue[turn] = []
	turn_queue[turn].append(effect)

