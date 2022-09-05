extends Node

enum Choice {
	COMBINE,
	SPLIT
}

enum Priority {
	CRITICAL,
	IMPORTANT,
	NORMAL,
	LOW
}

enum Resolve {
	PENDING,
	ON_START,
	ON_START_TURN,
	ON_ROLL,
	ON_CHOICE,
	ON_COMBINE,
	ON_SPLIT,
	ON_END_TURN
	ON_END
}


func timer(time = 3.0):
	   yield(get_tree().create_timer(time), "timeout")
