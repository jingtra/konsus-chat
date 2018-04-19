import {LOAD_MESSAGES, LOAD_THREADS, LOGIN, LOGOUT, NEW_MESSAGE} from './actionConstants';
import {get, post} from "./httpApi";
import ActionTypes  from './ChatConstants';
var socket = io.connect('http://localhost:4000');

export function login(name) {
  return (dispatch, getState) => dispatch(post('/api/login', {name}))
    .then(obj => {
      dispatch({type: LOGIN, payload: obj})

      socket.on("user-"+obj.id, function (data) {
        dispatch({type: NEW_MESSAGE, message: data});
      });
    })
}

export function logout(name) {
  return (dispatch, getState) => dispatch({type: LOGOUT});
}

export function clickThread(threadID) {
  return {
    type: ActionTypes.CLICK_THREAD,
    threadID: threadID
  };
}


export function getAllThreads(){
  return dispatch => dispatch(get("/api/threads"))
    .then(threads=>{
       var messages = {};
       var threadMap = {};
       threads.forEach(t=>{
         if(t.lastMessage){
           messages[t.lastMessage.id] = t.lastMessage;
           t.lastMessage = t.lastMessage.id;
         }
         threadMap[t.id] = t;
       })
        dispatch({type: LOAD_MESSAGES, payload: messages});
      dispatch({type: LOAD_THREADS, payload: threadMap});

    })
}

export function getMessages(threadId){
  return dispatch => dispatch(get("/api/messages", {threadId}))
    .then(messages=>{
      var messageKey = {};
      messages.forEach(m=>messageKey[m.id]=m);
      dispatch({type: LOAD_MESSAGES, payload: messageKey});
    })

}

export function postNewMessage(text, threadId){
  return dispatch => dispatch(post("/api/messages", {message: text, threadId}))
    .then(message=>{
      dispatch({type: NEW_MESSAGE, message: message});
    })

}

/*

export function postNewMessage(text, currentThreadID) {
  return dispatch => {
    let message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID);
    dispatch(createMessage(message));
    ChatExampleDataServer.postMessage(message, createdMessage => {
      dispatch(receiveCreatedMessage(createdMessage, message.id));
    });
  }
}
*/

