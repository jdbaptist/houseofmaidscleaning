importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js");
// importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-analytics.js");
firebase.initializeApp({
  apiKey: "AIzaSyCfbV1AWQXOuqO4z13HPqKrUYrFrbgRLzg",
  authDomain: "notifications-124e7.firebaseapp.com",
  databaseURL: "https://notifications-124e7.firebaseio.com",
  projectId: "notifications-124e7",
  storageBucket: "notifications-124e7.appspot.com",
  messagingSenderId: "743944281568",
  appId: "1:743944281568:web:20d311fd425c0125cfdf85",
  measurementId: "G-MH7MQQ1HSJ",
});
const messaging = firebase.messaging();
// firebase.analytics();
