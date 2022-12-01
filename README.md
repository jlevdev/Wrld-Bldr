# Setup

## Requirements
- npm installed
- A way to switch into Python 3.8.10 (e.g. venv)
- powershell ver 7
- Docker
- The .env file (not stored on github)
- The ability to convert my powershell scripts into bash (mac devs ;D)

## Windows Steps
- Add the .env file to the same directory as manage.py
- Open powershell (version 7) and run `./db-setup.ps1`
- setup venv or switch to python 3.8.10 in global environment for your machine
- `pip install -r ./requirements.txt`
- `npm i`
- `npm run watch`
- You should be able to see the frontend render in http://localhost on your machine
- Leave the server running, in a separate terminal window run `./db-reset.ps1`
- Once this finishes yo will have a database with a default use and settlement
- Ready to dev :D