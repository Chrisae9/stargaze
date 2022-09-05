extends Effect
class_name Shield

export(int) var block

func action(battle, sender, receiver):
	sender.gain_block(block)

