this program runs only after database is uped.  
So one simple solution is running docker compose at ../.  

build:
`mvnw package spring-boot:repackage -DskipTests=true`