extends Resource
class_name card_details

export(String) var card_name

export(String) var description

export(int) var cost

export(int) var durability

enum Type {
	ATTACK,
	SHIELD,
	SCRAP
}

export(Array, Type) var types

enum Rarity {
	COMMON,
	UNCOMMON,
	RARE
}

export(Rarity) var rarity

export(Array, Resource) var effects

export var suitable_slots : Array = [false, false, false, false, false, false]



