# Scaffold Meteor + Vue

## Test Endpoints

ddp --host 34.72.222.234 --port 80 connect
## Register Player IrvingTsukune
ddp --host 34.72.222.234 --port 80 call 'playerSignup' '{"firstName":"Irving","lastName":"Guerra","username":"IrvingTsukune","email":"iguerrav1500@alumno.ipn.mx","gender":"male","birthday":"1997-09-19","phone":{"lada":"+52","number":5531044967}}'
## Register Player GokuKakaroto
ddp --host 34.72.222.234 --port 80 call 'playerSignup' '{"firstName":"Goku","lastName":"Kakaroto","username":"Goku","email":"goku@gmail.com","gender":"male","birthday":"1997-09-19","phone":{"lada":"+52","number":5531044967}}'
## Register Player VeguetaGarcia
ddp --host 34.72.222.234 --port 80 call 'playerSignup' '{"firstName":"Rene","lastName":"Garcia","username":"Vegueta Garcia","email":"reneGarcia@alumno.ipn.mx","gender":"male","birthday":"1997-09-19","phone":{"lada":"+52","number":5531044967}}'

## Ver usuarios registrados
ddp --host 34.72.222.234 --port 80 subscribe 'players'
## Enviar solicitud de amistad
ddp --host 34.72.222.234 --port 80 call 'sendFriendRequest' '{"idSender":"LTJ8ihtN8armEJZz2","idTargetPlayer":"oPD23cdJcjJngbuSG"}'
## Aceptar solicitud de amistad
ddp --host 34.72.222.234 --port 80 call answerFriendRequest "MARMMFc7in9YdNxXK"
## Ver solicitudes de amistades
ddp --host 34.72.222.234 --port 80 subscribe 'friendRequest' 'oPD23cdJcjJngbuSG'

##
db.auth(root,root123)
db.users.find({ username: "Goku" })

## Description

Web app built with Meteor and Vue, include:
- Authentication
- Users management


Supported Platforms
-------------------

- macOS 10.12+
- Linux
- Windows 10

System Requirements
-------------------

- Node 12+ [download here](https://nodejs.org/es/download/)
- Yarn 1.16.0+
- Meteor 1.10.1 [Installation](https://www.meteor.com/install)
- Mongo 4.0+ and Robo 3T [download here](https://www.mongodb.com/download-center/community)
- **Note:** In some cases it is necesary to disable antivrus in order to works SMTP Server

## Installation

- Clone the last version of repository [here](https://gitlab.com/anticabrera/scaffold-meteor-vue.git)
- Verify you are on branch **dev**

**Database configuration with terminal**

Note: For Windows Systems verify that mongo is configured as environment system variable.

1. Open a terminal in the project root
2. Restore the database with:
```shell
mongorestore --db scaffold ./database/scaffold
```

**The following commands are only for support:**

- Export a backup of the database (data exported as formats BSON and JSON):
```shell
mongodump --db scaffold --out ./database/
```

- Import more data of a specific collection to the database:
```shell
mongoimport --db scaffold --collection <collection_name> <path_collection_json>
```

- Export data of a specific collection from the database:
```shell
mongoexport --db scaffold --collection <collection_name>
```


**Installing dependencies**

- Run the following commands to install the dependencies:
```shell
yarn
```

**Configure environment variables file**

Go to `./settings/` and copy `settings-development-example.json` to `settings-development.json` and modify the following:

- **STORAGE_PATH** to your path project in your PC/MAC.

Running project
---------------

**On Mac OS X and Linux**
- Run the following commands:
```shell
yarn run:mac
```

**On Windows**
- Run the following commands:
```shell
SET MONGO_URL=mongodb://localhost:27017/scaffold
yarn run:windows
```


**Note:**
You can configure your Jetbrains IDE to run the project from the IDE execution button.

Audit Code
---------------

**Requirements**
- Sonar Qube 7.8 (since require Java 8) [download here](https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.8.zip)
- Sonar Scanner [download here](https://docs.sonarqube.org/7.8/analysis/scan/sonarscanner/)
- Copy *sonar-project.properties.example* file to a new file in the same path without *.example* 
and adjust **sonar.sources** option according to your path project in your PC or Mac.
- Optional: You may install also Sonar Lint Plugin for Jetbrains to audit code in your IDE.

You have to start SonarQube server and then configure Sonar Scanner as system environment variable. Once all this done,
execute the next command in the root project:
```shell
sonar-scanner
```
