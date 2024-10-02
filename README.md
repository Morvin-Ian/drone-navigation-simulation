# Drone Navigation Simulation
https://github.com/user-attachments/assets/8658b98d-ed47-49b1-bb18-5c3a5b095692


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
