import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {CometChat} from '@cometchat-pro/react-native-chat';

import {COMETCHAT_CONSTANTS} from './CONSTS';
import Home from './src/Home';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();

  let appID = COMETCHAT_CONSTANTS.APP_ID;
  let region = COMETCHAT_CONSTANTS.REGION;
  let appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .autoEstablishSocketConnection(true)
    .build();
  CometChat.init(appID, appSetting).then(
    () => {
      console.log('Initialization completed successfully');
    },
    error => {
      console.log('Initialization failed with error:', error);
    },
  );

  const login = () => {
    var UID = 'superhero1';
    var authKey = COMETCHAT_CONSTANTS.AUTH_KEY;

    console.log(authKey);

    CometChat.getLoggedinUser().then(
      user => {
        console.log(user);
        if (!user) {
          CometChat.login(UID, authKey).then(
            user => {
              console.log('Login Successful:', {user});
              setUser(user);
              setIsLoggedIn(true);
            },
            error => {
              console.log('Login failed with exception:', {error});
            },
          );
        } else {
          console.log('Already logged in.', {user});
          setUser(user);
          setIsLoggedIn(true);
        }
      },
      error => {
        console.log('Something went wrong', error);
      },
    );
  };

  if (isLoggedIn) return <Home user={user} />;

  return (
    <View>
      <Text>App</Text>
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default App;
