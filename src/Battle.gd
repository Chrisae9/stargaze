extends Node

var turn : int = 0

signal start
signal start_turn
signal end

onready var charge := $CanvasLayer/Charge
onready var slots := $CanvasLayer/Slots
onready var turn_label := $CanvasLayer/Turn

onready var player := $Player
onready var enemy := $Enemy

func _ready() -> void:
	randomize()
	connect("start", self, "on_start")
	connect("start_turn", self, "on_start_turn")
	charge.connect("roll", self, "on_roll")
	charge.connect("choice", slots, "activate_slots")
	charge.connect("choice", self, "on_choice")
	charge.connect("end_turn", slots, "reset_color")
	charge.connect("end_turn", self, "on_end_turn")
	player.connect("death", self, "on_player_death")
	enemy.connect("death", self, "on_enemy_death")
	connect("end", self, "on_end")
	connect("end", charge, "disable_buttons")
	

	emit_signal("start")
	
func resolve_effects(effect_window, sender, receiver):
	#print(Global.Resolve.keys()[effect_window])
	if sender.turn_queue.has(turn):
		for effect in sender.turn_queue[turn]:
			effect.trigger_effect(self, effect_window, sender, receiver)
	
func on_start():
	slots.setup_slots(player)
	resolve_effects(Global.Resolve.ON_START, enemy, player)
	resolve_effects(Global.Resolve.ON_START, player, enemy)
	emit_signal("start_turn")

func on_start_turn():
	turn += 1
	turn_label.text = "Turn: " + str(turn)
	print("resetting player block")
	player.reset_block()
	enemy.move(turn)
	resolve_effects(Global.Resolve.ON_START_TURN, enemy, player)
	resolve_effects(Global.Resolve.ON_START_TURN, player, enemy)


func on_roll(val1, val2):
	print("rolled " + str(val1) + "," + str(val2))
	resolve_effects(Global.Resolve.ON_ROLL, enemy, player)
	resolve_effects(Global.Resolve.ON_ROLL, player, enemy)
	
func on_choice(type, roll: Array):
	player.activate_cards(roll, turn)
	resolve_effects(Global.Resolve.ON_CHOICE, enemy, player)
	resolve_effects(Global.Resolve.ON_CHOICE, player, enemy)
	
func on_end_turn():
	resolve_effects(Global.Resolve.ON_END_TURN, player, enemy)
	print("resetting enemy block")
	enemy.reset_block()
	resolve_effects(Global.Resolve.ON_END_TURN, enemy, player)
	emit_signal("start_turn")
	
func on_player_death():
	emit_signal("end", false)
	
func on_enemy_death():
	emit_signal("end", true)
	
func on_end(win: bool):
	$GameEnd.show()
	if win:
		$GameEnd.text = "YOU WIN"
	else:
		$GameEnd.text = "YOU LOSE"
	
	



	
