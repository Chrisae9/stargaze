extends Resource
class_name Effect

export(String) var effect_name
export(int) var duration = 1

export(Global.Priority) var priority = Global.Priority.LOW

export(Global.Resolve) var resolve = Global.Resolve.ON_END_TURN

func trigger_effect(battle, effect_window, sender, reciever):

	if effect_window != resolve:
		return
	print(effect_name, " " + Global.Resolve.keys()[effect_window], " " + Global.Resolve.keys()[resolve])
	action(battle, sender, reciever)

func action(battle, sender, reciever):
	pass

