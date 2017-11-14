## Kullaberg Citizen Science
[![Build Status](https://travis-ci.org/xtreemze/KullabergCitizenScience.svg?branch=master)](https://travis-ci.org/xtreemze/KullabergCitizenScience) ![Dependency Status](https://david-dm.org/xtreemze/KullabergCitizenScience/status.svg?branch=master) ![Dev Dependency Status](https://david-dm.org/xtreemze/KullabergCitizenScience/dev-status.svg?branch=master)

## Hosting
The example project is hosted on a public github repository. https://xtreemze.github.io/KullabergCitizenScience/

You can get started using:
```javascript
git clone https://github.com/xtreemze/KullabergCitizenScience.git
```

Then install dependencies with: 
```javascript
npm i -D
```

You are asked to collaborate on the existing project or generate your own repository that adheres to the guidelines specified in this document, preferably by forking. The project is then to be merged with the master branch in the repository and will be maintained by Kullaberg Staff. Your future contributions would always be welcome.

## License
The app is to be open source according to the GNU GENERAL PUBLIC LICENSE 3. 

## NPM Dependencies
New dependencies can be added if necessary, particularly with regard to database interaction through sockets. Currently the project has the following dependencies:
- "autoprefixer": "^7.1.6",
- "browserslist": "^2.8.0",
- "css-loader": "^0.28.7",
- "extract-loader": "^1.0.1",
- "extract-text-webpack-plugin": "^3.0.2",
- "file-loader": "^1.1.5",
- "html-loader": "^0.5.1",
- "html-minifier-webpack-plugin": "^1.1.1",
- "html-webpack-plugin": "^2.30.1",
- "image-webpack-loader": "^3.4.2",
- "jquery": "^3.2.1",
- "materialize-css": "^0.100.2",
- "offline-plugin": "^4.8.4",
- "postcss": "^6.0.14",
- "postcss-loader": "^2.0.8",
- "rimraf": "^2.6.2",
- "style-loader": "^0.19.0",
- "uglifyjs-webpack-plugin": "^1.0.1",
- "url-loader": "^0.6.2",
- "webpack": "^3.8.1",
- "webpack-dev-server": "^2.9.4"

## Target Environment
Modern browsers are targeted, primarily on the mobile end. Because target browsers have acceptable support for ES6, we will not be using Babel in Webpack. This app should be a single page app with javascript driving changes in the DOM. Use ES6 template strings to make html templates within javascript. For example:
```javascript
this.card = `<div class="cardContainer" id="${this.title}">
<div class="col s12 m6">
  <div class="card">
    <div class="card-content">
      <span class="card-title">${this.title}</span>${this.description}</div>
  </div>
</div>
</div>
`;
```
from

``
./app/js/missions.js
``

## Front-End Framework
Materialize-CSS is chosen for the front end http://materializecss.com/getting-started.html

## Graphic Design Guidelines
Material Design https://material.io/guidelines/
Use icons to replace text whenever possible.

## Design Philosophy
Design should be mobile first and should generally adhere to the Progressive Web App philosophy when possible. https://developers.google.com/web/progressive-web-apps/

## Continuous Integration
Configured for automatic Travis CI deployment to gh-pages branch if webpack compiles without errors.

## Database Server
A NoSQL database such as the community version of MongoDB would be preferred to allow for the most flexibility and so javascript and node can be used to interact with the server and database.

## Code Style
Javascript ES6 style is preferred.Note that jquery code is possible but jquery will be phased out soon in an upcoming version of the materialize-css framework. Prettier is used to format code and keep a consistent yet flexible style. https://prettier.io/ Try to use descriptive names for variables, objects and functions using camelCase. If this is not possible, comment your code thoroughly to explain what is going on. Webpack will minify the code so long filenames will not slow the app down.

## Development
VS Code is recommended but you can use your own development environment. You are free to work in the app folder to add and improve features. 

### Production Export

Use
```javascript
npm run exportp
```
to export the files to the “public” directory as a static progressive web-app with offline support. To include new js files, make sure to add the 
```javascript
require(‘./app/js/yourFilename.js’)
```
to  
```
./app/entry.js
```
 so it can be processed and compiled by webpack. 
 
 ### Live Development Server
 You are motivated to use 
 ```javascript
 npm run dev
 ```
 to run a localhost test and ensure there are no errors before publishing.

## Feature Requests
#### Interface
- Complete a Mission or View Data Add two sections to the front end interface, one to view and select missions and a second to view the results of a mission.
    - Completing Missions will gather data from the phone and user to send to the database.
    - View Data will retrieve information from the server. It should be able to display results on a map, sort by date.
#### Data Collection
- Create a server to host a MongoDB database for the app and create one collection for each “Mission” that will contain the results of the data being gathered by users.
    - Data will be gathered while in remote areas so assume offline use. Use localstorage or IndexedDB to store the data
    - Upload the data when the user is online.
#### Missions
- Extend the “Mission” class to include parameters and generate forms from es6 templates.
    - Create new “Mission”: Trail Condition
    - Create new “Mission”:  Porpoise Spotting
#### Gamification
- Gamify the submission of data to motivate users to participate in the long term. For instance: Use SVG / CSS animation to throw confetti upon submission of 10 mission data sets, thereby reaching level 1.
- Add 20 additional levels and raise difficulty gradually.
#### Rewards
- Add a random reward spinner/dice roll after completion of each level offering free coffee, free naturum water bottle, free towel and other potential rewards to be determined.
    - Rewards are to be collected in Naturum by showing the rewards display to Kullaberg staff.
- Kullaberg staff should be able to validate the reward and then report the reward as collected.

