# errand_runner

this repository contains the front end framework built to interact with the errand_runner API, which can be found here: https://github.com/AnnaKL/errand-runner-rails-api

errand_runner is a simple application to help you complete your everyday's tasks. with errand_runner you can:

* create a task
* see task on a map
* select and accept someone else's task
* see the navigation to the task delivery address

* with errand_runner you'll be able to:
* get in touch with other people via chat
* add a reward to your task (errand_runner currency)
* leave a feedback about errand_runner's users

user stories
-----

```
as a busy person  
so that I can outsource errands
I would like to create a task

as a busy person
so that I can find a nearby helper
I would like to place my task on a map visible to all

as a busy person  
so that I can outsource many errands
I would like to create a list of tasks

as a busy person
so that I can find nearby helpers
I would like to place multiple tasks on a map visible to all

as a helper
so that I can fulfill a task
I would like to see tasks near me

as a busy person
so that I can use this service
I would like to be able to sign up/in/out

as a helper
so that I can be of service
I would like to be able to sign up/in/out

as a busy person  
So that I know the task is in hand
I would like to be notified it has been accepted and by whom

as a helper
So that know where to deliver
I would like the directions from point of collection to delivery address
```

technology
-----

* errand_runner works on ios devices and was built using ionic
* the api is built using rails and hosted on heroku
* testing was achieved using rspec, protractor and karma

installation
-----

* git clone this repository 
* cd into the errand-runner-mobile folder locally
* `ionic serve` will show the app as a webpage
* `ionic serve --lab` will show the app in the browser as it would look on a mobile device
* `ionic emulate` will display the app on your local emulator

if you have an ionic account, you can use `ionic upload` to upload to ionic, and using the ionic view app, it can then be run on your mobile (currently only supported on ios)

completed so far
-----

* a user can sign up for an errand_runner account
* a user can view all current tasks on a map which centers on their location
* a user can add a task they need completing with a delivery and pickup address
* a user can view a task with directions from the pickup address to the delivery address
* a user can accept a task

to do
-----

* refactor
* add front end testing
* add a chat function so that two users can discuss details of a task
* add a further location element so that a user can see the details of a task in relation to their own journey
* add a point/reward scheme
* add a feedback function
