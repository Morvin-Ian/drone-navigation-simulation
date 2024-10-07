# Drone Navigation Simulation

https://github.com/user-attachments/assets/08372d81-5662-4b48-8453-56ece4f7847e

## Setup
    1. git clone git@github.com:Morvin-Ian/drone-navigation-simulation.git
    
### Run Application
    - make build
    - make makemigrations
    - make migrate
    - make superuser
    - make seed (Seed Drones)
    - make shell
        to load the boundaries data run these commands in the shell
        >>> from navigate.data import load_layer
        >>> load_layer.run()
        >>> quit()
