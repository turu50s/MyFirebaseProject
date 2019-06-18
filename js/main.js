(() => {
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

  // Firebase Auth instance
  const auth = firebase.auth();
  let me = null;

  const message = document.getElementById('message');
  const form = document.querySelector('form');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');

  // collection.orderBy('created').get().then(snapshot => {
  //   snapshot.forEach(doc => {
  //     const li = document.createElement('li');
  //     li.textContent = doc.data().message;
  //     messages.appendChild(li);
  //   });
  // });


  login.addEventListener('click', () => {
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () => {
    auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      me = user;

      while (messages.firstChild) {
        messages.removeChild(messages.firstChild);
      }

      // 変更を監視する
      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const li = document.createElement('li');
            const d = change.doc.data();
            li.textContent = d.uid.substr(0, 8) + ': ' + d.message;
            messages.appendChild(li);
          }
        });
      }, error => {});
      console.log(`Logged in as: ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, messages].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }
    me = null;
    console.log('Nobady is logged in');
    login.classList.remove('hidden');
    // form.classList.remove('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.add('hidden');
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
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobady'
    })
    .then(doc => {
      console.log(`${doc.id} added!`);
    })
    .catch(error => {
      console.log('document add error!');
      console.log(error);
    });
  });
})();