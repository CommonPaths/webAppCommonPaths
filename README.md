# CommonPaths WebApp
Modern Geographic Information System (GIS) Web-based Application to support effective pathway assessment and ADA compliant route formulation that leverages data from common data platform such as OpenStreetMaps, United States Geological Survey (USGS), general transit feed specification (GTFS), and repeated transit request information. Multi-tenant cloud based system solution.
#### Initial steps to get Dev up and running
1. Install/run Postgres
2. Clone the repo
3. Create database and edit the config.json with database details
4. Run sequelize migrate scripts
5. Start Dev node server

#### **Copy neceessary files
- copy env.examples to .env in the projects root folder
- copy `config/config.json.example` to `config/config.json`
#### **Edit <webapp folder>/config/config.json with database details**
```json
  "development": {
    "username": "XXXXXXX",
    "password": "XXXXXXXXXXXXX",
    "database": "XXXXXXXXXXXXX",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
  }
```
- `username`, `password`, 'port' and `database` need to match your local postgres instance
#### **How to start the node js server with dev. and test prod. env.**
```bash
DEBUG=commonPaths:* npm start
DEBUG=commonPaths:* npm run devstart
```

#### **Then save file and run the follwoing to create the tables in the "sea" database**
```bash
npm run sequelize:sea:migrate
```

#### Run Seed to pre-populate the "sea" database with seed data 
```bash
npm run sequelize:sea:seed:all
```
#### Running ESLint on your code
```bash
# runs on all relevant files
npx eslint . 
# run linter on one file
npx eslint <filename>
# run linter and attempt to autofix issues
npx eslint <filename> --fix
```

#### Accessing local instance of the WebApp
Subdomains are not suppoted through `localhost` so you have to go through a website such as `lvh.me` to access your localhost with a subdomain. It will still be hitting your local host but it does have to go through an external address. To access the local instance go to `sea.lvh.me:3000`.

#### Multitenancy
To add a tenant to the webapp you will need to:
- create a new database for the new tenant in postgres
- add a group in cognito that is the same as the subdomain for the tenant
- update the config/config.json file
- create a `.sequelize-<tenant>` file in the root directory 
- run the migrations on the new db using the above `.sequelize-<tenant>` file
- run any necessary seed files using the above `.sequelize-<tenant>` file

#### First WebApp User, Per Tenant.
The WepApp utilizes AWS Cognito for user authentication. The initial WebApp user will need to be seeded into each tenant's database
- Create a user in cognito and add the tenant's group to that user (create the group if need be).
- Seed the db with the email address of the new user (which should be the same as the cognito username) and the cognito sub for that user, which can be found in the user information from the Cognito dashboard.

#### Adding Historical Pictures (for Seattle tenant only).
All Seattle historical pictures are kept in `./public/images/historicPictures/` folder path.
Create the following historical picture layer folders and populate corresponsing sub-folders and files in each layer folder.
```
public/images/historicPictures/busStop/
public/images/historicPictures/curbCut/
public/images/historicPictures/incline/
public/images/historicPictures/info/
public/images/historicPictures/location/
public/images/historicPictures/traffic/
public/images/historicPictures/unevenS/
```
