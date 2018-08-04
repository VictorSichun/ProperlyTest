# Properly Coding Challenge
Code challenge for full stack developers.

## Objectives
 - Assess software development skills such as:
    - Problem solving
    - Software quality
    - Code quality
    - Task Sizing and Work Estimation
    - Use of Tools (e.g. Git)
    - Delivery

## Format
 - Assigment to be developed at the candidate's own time/estimates. There is a limit as to how long this should take and we also measure against that.
    - The candidate will estimate the task
    - Develop
    - Upload the code to a public github repository
    - Demo the delivery and present the delivery during the technical interview
    - Pair programming during the technical interview. 2 additional requirements will be added and should be developed during a pair programming session (20 to 45 mins max).

## Problem Statement

Given a **Database** of:
### Users
 - name
 - email
 - location
 - subscriptionId

### Subscriptions
 - id
 - name
 - priceType

### Properties
 - id
 - userId
 - title
 - location
 - type
 - numberOfRooms
 - timeZone

### Bookings

 - id
 - propertyId
 - startDate
 - endDate

USe the **JSON dataset** that we have provided in the repository. 

#### Task Group 1
create functions that return:
 - All users from a particular city

 - All users from a particular company (a user of a company is a user that has the same email domain. E.g for john@getproperly.com and company@getproperly.com "getproperly.com" is the email domain)

 - All users from Free tier subscription which have more than 6 properties

 - All users from Premium tier subscription which have less than 4 properties

 - All users that live in a different city than their properties

#### Task Group 2
create a function that return:
 - All bookings for a **given period** (start and end dates).
    - The bookings returned should have the startDate and endDate formated to dd/MM/YYYY HH:mm using the property timeZone. 
    - The **given period** is also provided in the Property timeZone.

- All bookings longer or equal to 25 days.

- All bookings shorter or equal to 3 days.

- All Properties with Bookings with 1 day or less between bookings

 - With the functions created expose them in a restful application and create a dashboard (simple UI) to display the results

#### Task Group 3

 - How to limit the users that live in a different city to just use premium subscription?


## FAQ
1 -  Where can I find the city for Property and User?
Use the GPS location provided.



npm install sql.js
npm install sqlite3