//require our websocket library 
const WebSocketServer = require('ws').Server;

//creating a websocket server at port 9090 
const wss = new WebSocketServer({ port: 9090 });



function sendTo(connection, message) {
   connection.send(JSON.stringify(message));
}
// accepting only JSON messages 
function receive(msg) {
   let data = null;
   try {
      data = JSON.parse(msg);
   } catch (e) {
      console.log("Invalid JSON");
      data = {};
   }
   return data;
}


/*
interface Peer {
   ws: WebSocket;
   ice: IceCandidate;
   name: string;
}
*/

// All signed-in peers
// Map: username => WebSocket
const peers = {};

//when a user connects to our sever 
wss.on('connection', function (connection) {

   console.log("User connected");

   //when server gets a message from a connected user 
   connection.on('message', function (message) {

      console.log(`-------------------------------------------------------------`);
      console.log(`Received: ${message}`);
      let data = receive(message);

      //switching type of the user message 
      switch (data.type) {

         /**
          * Sign-in
          */
         case "login": {
            const username = data.receiver;
            //if anyone is logged in with this username then refuse 
            if (peers[username]) {
               console.log(`User ${username} failed to log in`);
               sendTo(connection, {
                  type: "login",
                  success: false
               });
            } else {
               console.log(`User ${username} logged in successfuly`);
               //save user connection on the server 
               peers[username] = connection;
               connection.owner = username;
               sendTo(connection, {
                  type: "login",
                  success: true
               });
            }
         } break;

         /**
          * Sign-off
          */
         case "leave": {
            console.log("Disconnecting from", data.receiver);
            const conn = peers[data.receiver];

            //notify the other user so he can disconnect his peer connection 
            if (conn != null) {
               conn.callee = null;
               sendTo(conn, {
                  type: "leave"
               });
            }
         } break;


         /**
          *  connection.owner wants to call Someone (data.receiver)
          */
         case "offer": {
            console.log("Sending offer to: ", data.receiver);
            // if Someone exists then send him offer details 
            const conn = peers[data.receiver];
            if (conn != null) {
               //setting that UserA connected with UserB 
               connection.callee = data.receiver;
               sendTo(conn, {
                  type: "offer",
                  offer: data.offer,
                  sendername: connection.owner
               });
            }
         } break;

         /**
          * connection.owner received [offer] and is sending [answer] back
          */
         case "answer": {
            console.log("Sending answer to: ", data.receiver);
            const conn = peers[data.receiver];
            if (conn != null) {
               connection.callee = data.receiver;
               sendTo(conn, {
                  type: "answer",
                  answer: data.answer
               });
            }
         } break;

         /**
          * Client's side looks like:
          * rtcConn.onicecandidate = (event)
          * websocket.send( event.candidate )
          * Here we are sending this 'candidate' to callee
          * connection.owner sent [candidate] to callee
          */
         case "candidate": {
            // connection.callee == data.receiver
            console.log(`Sending candidate to ${data.receiver}`);
            const conn = peers[data.receiver];
            if (conn != null) {
               sendTo(conn, {
                  type: "candidate",
                  candidate: data.candidate
               });
            }
         } break;

         /**
          * Unknown command
          */
         default: {
            sendTo(connection, {
               type: "error",
               message: "Command not found: " + data.type
            });
         } break;

      }
   });

   //when user exits, for example closes a browser window 
   //this may help if we are still in "offer","answer" or "candidate" state 
   connection.on("close", () => {
      delete peers[connection.owner];
      if (connection.callee) {
         console.log("Disconnecting from ", connection.callee);
         const calleeConn = peers[connection.callee];
         if (calleeConn != null) {
            calleeConn.callee = null;
            sendTo(calleeConn, {
               type: "leave"
            });
         }
      }
   });

});

