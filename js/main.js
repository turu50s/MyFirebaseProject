'use strict';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBchoMaRxl8TW2i4Z9SjNRoNd6GcHJ-muA",
  authDomain: "myfirebasechatapp-f2fd0.firebaseapp.com",
  databaseURL: "https://myfirebasechatapp-f2fd0.firebaseio.com",
  projectId: "myfirebasechatapp-f2fd0",
  storageBucket: "myfirebasechatapp-f2fd0.appspot.com",
  messagingSenderId: "385221285095",
  appId: "1:385221285095:web:e296b64b02e2c427"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
// db.settings({
//   timestampsInSnapshots: true
// });
const collection = db.collection('messages');

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');

// collection.orderBy('created').get().then(snapshot => {
//   snapshot.forEach(doc => {
//     const li = document.createElement('li');
//     li.textContent = doc.data().message;
//     messages.appendChild(li);
//   });
// });

// 変更を監視する
collection.orderBy('created').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const li = document.createElement('li');
      li.textContent = change.doc.data().message;
      messages.appendChild(li);
    }
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  
  const val = message.value.trim();
  if (val === "") {
    return;
  }

  // const li = document.createElement('li');
  // li.textContent = val;
  // messages.appendChild(li);
  
  message.value = '';
  message.focus();

  collection.add({
    message: val,
    created: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(doc => {
    console.log(`${doc.id} added!`);
  })
  .catch(error => {
    console.log(error);
  });
});

message.focus();
