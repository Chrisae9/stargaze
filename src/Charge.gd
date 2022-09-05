extends Control

signal roll
signal choice
signal resolve_effects
signal end_turn

onready var charge := $MarginContainer/VBoxContainer/Charge
onready var combine := $MarginContainer/VBoxContainer/HBoxContainer/Combine
onready var split := $MarginContainer/VBoxContainer/HBoxContainer/Split
onready var end_turn := $MarginContainer/VBoxContainer/EndTurn

onready var dice1 := $MarginContainer/VBoxContainer/die1
onready var dice2 := $MarginContainer/VBoxContainer/die2

var roll := []

enum button_state {
	CHARGE,
	CHOICE,
	END_TURN,
	DISABLED
}

func _ready() -> void:
	connect("roll", self, "update_dice")
	charge.connect("pressed", self, "roll")
	combine.connect("pressed", self, "choice", [Global.Choice.COMBINE])
	split.connect("pressed", self, "choice", [Global.Choice.SPLIT])
	end_turn.connect("pressed", self, "end_turn")
	button_view(button_state.CHARGE)
	
func button_view(b):
	if b == button_state.CHARGE:
		charge.disabled = false
		combine.disabled = true
		split.disabled = true
		update_dice(0, 0)
	if b == button_state.CHOICE:
		charge.disabled = true
		combine.disabled = false
		split.disabled = false
	if b == button_state.END_TURN:
		charge.disabled = true
		combine.disabled = true
		split.disabled = true
	if b == button_state.DISABLED:
		charge.disabled = true
		combine.disabled = true
		split.disabled = true
		end_turn.disabled = true
		
	
func roll():
	roll = [randi() % 3 + 1, randi() % 3 + 1]
	emit_signal("roll", roll[0], roll[1])
	button_view(button_state.CHOICE)

func update_dice(val1, val2):
	dice1.text = str(val1)
	dice2.text = str(val2)
	
	
func choice(type):
	if type == Global.Choice.COMBINE:
		emit_signal("choice", type, [roll[0] + roll[1]])
	if type == Global.Choice.SPLIT:
		emit_signal("choice", type, [roll[0], roll[1]])
	button_view(button_state.END_TURN)

func end_turn():
	button_view(button_state.CHARGE)
	emit_signal("end_turn")
	
func disable_buttons(_end):
	print("here")
	button_view(button_state.DISABLED)
	
