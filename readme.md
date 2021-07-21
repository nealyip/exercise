# Exercise
Here is the repo for the assignment.  
Basically we have 4 tables.

### Brand
id: auto-increment  
name: string

### Sport
id: auto-increment  
name: string  

### Product
id: auto-increment  
sport_id: int  
brand_id: int  
name: string  
sport_id+brand_id+name has a composite unique key.  

### Product options
id: auto-increment  
product_id: int  
size: string  
color: string  
duration: int (days)  
product_id+size+color has a composite unique key.  

####
Product has many options which implies one product can have different sizes and colors.  

# Prerequisite
1. Install Docker  
2. Install latest Docker-compose   
2. Install Node-14 (optional, for local development.)  
3. Make sure the port 3333 is available.  

# [QUICK START] Running the app in a docker container
1. Copy .env.example to .env in the root folder  
2. Run `docker-compose up` or (`docker compose up` for a new version of docker)  
3. Optional, as long as there are some changes on the source code, run `docker compose up --build -V` to rebuild  
4. The server should run on 3333 port.  
5. For testing purpose, it's possible to have some seed data written into the database.  
   `docker exec -it exercise_web1 npm run seed`
### Troubleshooting
If you suffer from an error stating a wrong version of the docker-compose.yaml, please find an update to the docker-compose package from the following link.  
`https://github.com/linkedin/datahub/issues/2020`

## CRUD Endpoints
The endpoints support both url-encoded and json input body.  
For simplicity, there is no authentication for the following endpoints.  

### 1. Brands
Create a brand  
```shell
curl -X POST http://127.0.0.1:3333/brands -d 'name=Forclaz'
# or
curl -X POST http://127.0.0.1:3333/brands -H 'content-type:application/json' -d '{"name":"Forclaz"}'
```
Get a single brand  
```shell
curl http://127.0.0.1:3333/brands/1
```
List all brands with pagination  
```shell
curl http://127.0.0.1:3333/brands
```
Edit a brand  
```shell
curl -X PATCH http://127.0.0.1:3333/brands/1 -d 'name=Oxelo'
```
Delete a brand  
```shell
curl -X DELETE http://127.0.0.1:3333/brands/4
```

### 2. Sports
Create a sport  
```shell
curl -X POST http://127.0.0.1:3333/sports -d 'name=Squash'
```
Get a single sport
```shell
curl http://127.0.0.1:3333/sports/1
```
List all sports with pagination
```shell
curl http://127.0.0.1:3333/sports
```
Edit a sport
```shell
curl -X PATCH http://127.0.0.1:3333/sports/1 -d 'name=Cycling'
```
Delete a sport
```shell
curl -X DELETE http://127.0.0.1:3333/sports/4
```

### 3. Products
Create a product
```shell
curl -X POST http://127.0.0.1:3333/products -H 'content-type:application/json' -d '{"name":"ADULT HARD GROUND FOOTBALL BOOTS AGILITY 500", "sport_id": 1, "brand_id": 1}'
```
Get a single product  
```shell
curl http://127.0.0.1:3333/products/1
```
List all products with pagination
```shell
curl http://127.0.0.1:3333/products
```
Edit a product
```shell
curl -X PATCH http://127.0.0.1:3333/products/1 -d 'name=Boots'
```
Delete a product
```shell
curl -X DELETE http://127.0.0.1:3333/products/4
```

### 3. Product Options
Create a product
```shell
curl -X POST http://127.0.0.1:3333/product-options -d 'product_id=1&size=L&color=Purple&duration=1000'
```
Get a single product option
```shell
curl http://127.0.0.1:3333/product-options/1
```
Edit a product option
```shell
curl -X PATCH http://127.0.0.1:3333/product-options/1 -d 'size=L'
```
Delete a product
```shell
curl -X DELETE http://127.0.0.1:3333/product-options/4
```

# Local development
## Preparation
1. Run `docker-compose up -d` to create the database. (or `docker compose up` for a newer version of docker.).
2. Run `docker-compose logs -f` (or `docker compose logs -f` for a newer version of docker). Wait until mysql is up as follows,
```
manager_1       | Mysql is up - executing command  
manager_1       | done  
```
3. Press ctrl-c to stop tailing the logs.  

**Either run the app in dev or production mode**
## Steps to start a local dev server
1. Run `npm i`
2. Copy .env.example to .env in the root folder
3. Edit .env if necessary, the mysql config and credentials will be used to create the database, as a result, it's ok to have no change to the .env file in this exercise.
4. Migrate the database with `npm run migrate`
5. Seed dev data `npm run seed`
6. Run `npm run dev` to start a dev mode with a hot reloading capability.
7. The server should run on 3333 port. If the port 3333 has been used already, the app will probably be started on another port.

## AOT compilation for production
1. Run `npm i`
2. Copy .env.example to .env in the root folder
3. Edit .env if necessary, the mysql config and credentials will be used to create the database, as a result, it's ok to have no change to the .env file in this exercise.
1. Run `npm run build`
2. Copy and rename .env.example to .env in the new build folder like `cp .env.example build/.env`
3. Update build/.env and set NODE_ENV=production if necessary, it turns off logging and hides stack traces for errors.
3. Follow the instruction from the terminal to start the production server
```
cd build
npm ci --production
node server.js
```

## Test ##
Run the test with local setup  
```npm
npm test
```

# Remove everything
1. Run `docker-compose down` or (`docker compose down` for a newer docker version)  
