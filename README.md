# Drone Navigation Simulation
[screen-capture.webm](https://github.com/user-attachments/assets/2e7e79ea-a1d4-48be-85f4-4e6faf5ffc7b)

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
