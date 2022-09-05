extends Control

export(Resource) var details

onready var summary_label := $Summary

func _ready() -> void:
	summary_label.text = details.summary
	
func update_move(move_details):
	details = move_details
	summary_label.text = details.summary
	
