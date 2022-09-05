extends Effect
class_name Attack

export(int) var damage

func action(battle, sender, receiver):
	receiver.take_damage(damage)
		
