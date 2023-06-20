import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {BottomSheet} from 'react-native-btr';
import PdfViewer from './components/PdfViewer';

const GroupDetails = ({guid}) => {
  const [groupDetails, setGroupDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [visible, setVisible] = useState(false);
  const [mediaMsg, setMediaMsg] = useState();

  useEffect(() => {
    let listenerID = 'examsaATHi32829';

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log('Text message received successfully', textMessage);
          setMessages([...messages, textMessage]);
        },
        onMediaMessageReceived: mediaMessage => {
          console.log('Media message received successfully', mediaMessage);
        },
        onCustomMessageReceived: customMessage => {
          console.log('Custom message received successfully', customMessage);
        },
      }),
    );

    return () => CometChat.removeMessageListener(listenerID);
  }, []);

  const getMessages = async () => {
    let limit = 30;
    var messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(guid)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      messages => {
        console.log('Message list fetched:', messages);
        setMessages(messages);
      },
      error => {
        console.log('Message fetching failed with error:', error);
      },
    );
  };

  const sendMessage = () => {
    let receiverType = 'group';
    let textMessage = new CometChat.TextMessage(
      guid,
      messageText,
      receiverType,
    );

    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:', message);
        setMessages([...messages, message]);
        setMessageText('');
      },
      error => {
        console.log('Message sending failed with error:', error);
      },
    );
  };

  useEffect(() => {
    CometChat.getGroup(guid).then(
      group => {
        console.log('Group details fetched successfully:', group);
        setGroupDetails(group);
      },
      error => {
        console.log('Group details fetching failed with exception:', error);
      },
    );

    getMessages();
  }, []);

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  const sendMediaMsg = file => {
    let receiverID = guid;
    let messageType = CometChat.MESSAGE_TYPE.FILE;
    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    let mediaMessage = new CometChat.MediaMessage(
      receiverID,
      file,
      messageType,
      receiverType,
    );

    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        console.log('Media message sent successfully', message);
        setMessages([...messages, message]);
      },
      error => {
        console.log('Media message sending failed with error', error);
      },
    );
  };

  const openGallery = async () => {
    let result = await launchImageLibrary({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      // aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    if (result.canceled) {
      // Handle cancellation...
      setVisible(false);
      return;
    }
    if (!result.canceled) {
      setVisible(false);
      //   console.log(result);
      var file = {
        name: Platform.OS === 'android' ? result.assets[0].fileName : name,
        type: Platform.OS === 'android' ? result.assets[0].type : type,
        uri:
          Platform.OS === 'android'
            ? result.assets[0].uri
            : result.assets[0].uri.replace('file://', ''),
      };
      console.log('file: ', file);
      //   setMediaMsg({file});
      sendMediaMsg(file);
      //   UploadImage(result.assets[0]);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const file = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };
      setVisible(false);
      sendMediaMsg(file);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(messages[messages.length - 1]?.data.attachments[0].url);

  return (
    <View style={{flex: 1}}>
      {/* <KeyboardAvoidingView> */}
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          borderWidth: 1,
          marginBottom: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          elevation: 5,
          backgroundColor: 'white',
          borderColor: '#ccc',
        }}>
        <Image
          source={{
            uri: groupDetails.icon
              ? groupDetails.icon
              : 'https://picsum.photos/200/300',
            height: 45,
            width: 45,
          }}
          style={{borderRadius: 25, marginRight: 10}}
        />
        <View>
          <Text style={{fontSize: 18, color: 'black'}}>
            {groupDetails.name}
          </Text>
          <Text style={{fontSize: 14, color: 'black'}}>
            {groupDetails.membersCount} members,{' '}
            {groupDetails.onlineMembersCount} Online
          </Text>
        </View>
      </View>
      <ScrollView>
        {messages.map(m => {
          return m.data.text ? (
            <View
              style={{
                padding: 10,
                backgroundColor: '#fff',
                marginBottom: 5,
                maxWidth: '80%',
                marginLeft: 10,
                borderRadius: 10,
                elevation: 2,
                alignSelf: 'flex-start',
              }}>
              <Text
                style={{
                  color: '#ABAB96',
                  fontSize: 12,
                  position: 'absolute',
                  marginLeft: 10,
                  marginVertical: 5,
                }}>
                {m.data.entities.sender.entity.name.split(' ')[0]}
              </Text>
              <Text style={{fontSize: 15, color: 'black', marginTop: 12}}>
                {m.data.text}
              </Text>
            </View>
          ) : (
            m.data.attachments && m.data.attachments[0].url !== '' && (
              <View
                style={{
                  backgroundColor: '#fff',
                  //   borderWidth: 1,
                  //   borderColor: '#ccc',
                }}>
                <Text
                  style={{
                    // color: '#ABAB96',
                    // fontSize: 12,
                    // position: 'absolute',
                    marginLeft: 10,
                    // marginVertical: 5,
                  }}>
                  {m.data.entities.sender.entity.name.split(' ')[0]}
                </Text>
                <Image
                  source={{
                    uri: m.data.attachments && m.data.attachments[0].url,
                    height: 350,
                    width: 300,
                  }}
                  style={{
                    // borderWidth: 2,
                    // borderColor: 'red',
                    marginLeft: 10,
                    marginBottom: 10,
                  }}
                />

                <Text>
                  {m.data.attachments[0].extension === 'pdf' ? (
                    <PdfViewer
                      name={m.data.attachments[0].name}
                      url={m.data.attachments[0].url}
                    />
                  ) : (
                    ''
                  )}
                </Text>
              </View>
            )
          );
        })}
      </ScrollView>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <TextInput
          style={{
            height: 50,
            borderWidth: 1,
            marginHorizontal: 5,
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: 10,
            padding: 10,
            width: '82%',
          }}
          value={messageText}
          onChangeText={text => setMessageText(text)}
        />
        {messageText ? (
          <Button title="Send" onPress={sendMessage} />
        ) : (
          <TouchableOpacity
            // style={styles.button}
            onPress={toggleBottomNavigationView}>
            <Text style={styles.buttonText}>Doc</Text>
            {/* <Ionicons name="attach" color="black" size={30} /> */}
          </TouchableOpacity>
        )}
      </View>
      {/* </KeyboardAvoidingView> */}
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        <View style={styles.bottomNavigationView}>
          {/* <TouchableOpacity onPress={pickImage} style={{alignItems: 'center'}}>
            <View style={styles.button}>
              <Ionicons name="camera-outline" color="#fff" size={20} />
            </View>
            <Text style={{color: '#fff'}}>Camera</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={openGallery}
            style={{alignItems: 'center'}}>
            <View style={styles.button}>
              {/* <Ionicons name="images-outline" color="#fff" size={20} /> */}
            </View>
            <Text style={{color: '#fff'}}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
            style={{alignItems: 'center'}}>
            <View style={styles.button}>
              {/* <Ionicons name="document-attach-outline" color="#fff" size={20} /> */}
            </View>
            <Text style={{color: '#fff'}}>Document</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  messages: {
    paddingHorizontal: 20,
    // height: "80%",
    // backgroundColor: "#fff",
    // marginTop: 10,
    paddingVertical: 10,
  },
  message: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  messageText: {
    fontSize: 16,
    marginHorizontal: 6,
    marginVertical: 4,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    top: 8,
    bottom: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messageSent: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageRecieved: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    color: '#00ABB3',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  bottomNavigationView: {
    // backgroundColor: "#17cfe3",
    // backgroundColor: Colors.primary,
    width: '100%',
    height: 200,
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GroupDetails;
