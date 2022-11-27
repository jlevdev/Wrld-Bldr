docker stop wbdb && docker rm wbdb && docker run -d --name wbdb -p 5432:5432 -e POSTGRES_PASSWORD=BatVale001 -e POSTGRES_USER=postgres -e POSTGRES_DB=wrldbldr postgres:bullseye
python ./manage.py makemigrations
python ./manage.py migrate
python ./manage.py makemigrations wrldbldr
python ./manage.py migrate wrldbldr
python ./manage.py generate_inventory
python ./manage.py init_wbdb