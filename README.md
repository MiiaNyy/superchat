# Superchat app

This project's goal was to practice using Googles BAAS Firebase. I created a chat app that uses Firebase Firestorr database, Firebase authentication and firebase realtime database. This was my first touch using and building the backend to my projects.

## What it does and how to use it?

Users sign in to the chat using Google authentication. They can choose their own username, color and icon which are 
used as indicators for other users in the chat. 

In the app there is one chat room where users can send text and image messages to each other. Users can see other 
users that are currently using app in the sidebars list. I created this element by updating the user document in the 
database every 20 seconds when user is using the app. Other function listens any updates in user database and shows 
user in the online list if their last appearance has been in the last three minutes.

## Problems run into and solved while creating this app
- How navigate in the Firebase Console
- How to create new database to Firestore and how to create new documents in it using Firebase Console and in my code
- How to fetch the data from database document and how to update or delete it
    - If user wants to change or update their user settings, how can I update all the messages documents from 
      that current user so in the message shows right user settings
- How other users that are using chat, can see who others are currently using the chat

