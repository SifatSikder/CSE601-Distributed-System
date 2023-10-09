# Adding a mongo container  

* Add mongo details in docker-compose file  
* up the docker-compose then go to the mongo shell and authenticate the user  
  **mongosh -u "rootUsernameInDockerCompose" -p "rootPassInDockerCompose"**
* set some variable in .env  
* create a config folder and add a environment file for variables(default+.env)  
* add a db.js file and use the mongo credentials there  
* use the db's export function to the in index.js  
* set the dependencies in the docker-compose file  
* adjust the db.js file to continously check for the db to be up if there is any failure  



# Test Links  

http://localhost:8000/api/user/register
{
  "email":"bsse1221@iit.du.ac.bd",
  "password":"1234"
}

http://localhost:8000/api/user/login
{
  "email":"bsse1221@iit.du.ac.bd",
  "password":"1234"
}

http://localhost:8000/api/user/dashboard