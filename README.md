# Drone Navigation Simulation
## Setup
    1. git clone git@github.com:Morvin-Ian/drone-navigation-simulation.git
    
### Run Application
    - make build
    - make makemigrations
    - make migrate
    - make superuser
    - make shell
        to load the boundaries data run these commands in the shell
        >>> from navigate.data import load_layer
        >>> load_layer.run()
        >>> quit()
