# Korpus, a Softronic and KTH Royal Institute of Technology project

A corpus (words, synonyms, linguistics) RESTful API

## Backend
Requirements:
- Node.js
- npm

Tech stack:  
- TypeScript
- Express
- TypeORM

How to use:  
- `Ctrl+Shift+B -> Build backend` (or run `npx tsc` command in `backend` directory)
- `Ctrl+Shift+B -> Watch build backend` to run a watcher to build when changes are made

API authentication with JSON Web Tokens (JWT)

## Frontend
Tech stack:
- Angular
- TBD...

## Adding features
- Make a new branch for the feature
- Push code to the branch
- Add needed tests
- Make a pull request when completed

## API Documentation


| Function | Routes |Body parameters|Response body|Description|
| ------------- |:-------------|:-------------|:-------------|:-------------|
| Get all phrases |GET /phrases |*`No body parameters needed`*|`text`: string - the phrase text<br>`id`: integer - the ID of the phrase<br>`synonym`: Synonym[] - an array of synonyms|Gets all the existing phrases|
| Get specific phrase | GET /phrases/:phraseid |*`No body parameters needed`*|`text`: string - the phrase text<br>`id`: integer - ID of the phrase|Gets one specific phrase|
| Add a phrase | POST /phrases |`text`: string - the text for the new phrase|`text`: string - the text of the phrase<br>`id`: integer - the ID of the phrase|Adds one phrase|
| Change a phrase | PUT /phrases |`phraseid`: number - ID of specified phrase<br>`text`: string - new text for the to-be changed phrase |`json`: status - 200 ok response|Changes the text of the synonym|
| Delete phrases | DELETE /phrases |`ids`: number[] - IDs of phrases|`deleted`: number[] - array of IDs for the deleted phrases|Deletion of one or more phrases through IDs|
|<br><br>|


| Function | Routes |Body parameters|Response body|Description|
| ------------- |:-------------|:-------------|:-------------|:-------------|
| Get all synonyms |GET /synonyms |*`No body parameters needed`*|`id`: integer - ID of the synonym<br>`phrase`: Phrase - object of the phrase<br>`meaning`: Phrase - object of the phrase set as meaning<br>`group`: Group - object of the group|Gets all the existing synonyms|
| Get one specific synonym out of all existing| GET /synonyms/:id |*`No body parameters needed`*|`id`: integer - ID of the synonym<br>`phrase`: Phrase - object of the phrase<br>`meaning`: Phrase - object of the phrase set as meaning<br>`group`: Group - object of the group|Gets one specific synonym|
| Add a synonym | POST /synonyms |`phrase`: integer - ID of phrase <br>`meaning`: integer - ID for the meaning of the phrase<br>`group(optional)`: integer - ID for the suitable customer group |`id`: integer - ID of the synonym<br>`phrase`: Phrase - object of the phrase<br>`meaning`: Phrase - object of the phrase set as meaning<br>`group`: Group - object of the group|Adds a synonym|Adds a synonym|
| Change a synonym | PUT /synonyms/:id |`phrase`: integer - ID of phrase <br>`meaning`: integer - ID for the new meaning<br>`group(optional)`: integer - ID for the new/old group |`id`: integer - the ID of the synonym<br>`phrase`: integer - ID of phrase<br>`meaning`: integer - ID for the new meaning<br>`group`: integer - ID for the new/old group|Changes the meaning and optionally the group of the synonym|
| Delete synonyms | DELETE /synonyms |`ids`: number[] - IDs of synonyms|`deleted`: number[] - array of IDs for the deleted synonyms|Deletion of one or more synonyms through IDs|
|<br><br>|



| Function | Routes |Body parameters|Response body|Description|
| ------------- |:-------------|:-------------|:-------------|:-------------|
| Get all customer groups |GET /groups |*`No body parameters needed`*|`name`: string - name of the group<br>`id`: integer - ID of the group|Gets all existing customer groups|
| Get specific customer group  | GET /groups/:id |*`No body parameters needed`*|`name`: string - name of the specified group<br>`id`: integer - ID of the specified group|Gets one specific customer group out of all existing groups|
| Add a customer group | POST /groups |`name`: string - the name for the new group|`name`: string - the name of the group<br>`id`: integer - the id of the group|Adds a customer group|
| Change a customer group | PUT /groups/:id |`name`: string - new name for the group|`json`: status - 200 ok response|Change the name of a customer group|
| Delete customer groups | DELETE /groups |`ids`: number[] - IDs of groups to be deleted|`deleted`: number[] - array for the deleted group IDs|Deletion of one or more customer groups through IDs|
|<br><br>|
