extends VBoxContainer


var comet = GameState.comet

func _ready():
	initialize_comet()

func initialize_comet():

	
	for mass in comet['mass_chunks']:
		var button = Button.new()
		button.text = str(mass) + " kg"  # Display the mass on the button
		add_child(button)
		button.pressed.connect(_on_button_pressed.bind(mass))
		
func _on_button_pressed(mass):
	print("Button for chunk with mass " + str(mass) + " kg was pressed.")
