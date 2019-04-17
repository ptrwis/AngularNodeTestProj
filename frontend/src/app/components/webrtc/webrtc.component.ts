import { Component, OnInit, ViewChild } from '@angular/core';

class RemotePeer {
  constructor(
    public username: string,
    public dataChannel: RTCDataChannel
  ) {
  }
}

class LocalPeer {
  constructor(
    public configuration: RTCConfiguration
  ) {

  }
}

class Server {
  peers: RemotePeer[]
}



@Component({
  selector: 'webrtc',
  templateUrl: './webrtc.component.html'
})
export class WebRtcComponent {

  localUsername = '';
  remoteUsername = '';
  msgToSend = '';
  msgs: string[] = [];
  loggedIn = false;

  //connecting to our signaling server 
  wsConn: WebSocket;

  rtcConn: RTCPeerConnection;
  dataChannel: RTCDataChannel;


  constructor() {

    this.wsConn = new WebSocket('ws://localhost:9090');

    this.wsConn.onopen = () => {
      console.log("Connected to the signaling server");
    };

    //when we got a message from a signaling server 
    this.wsConn.onmessage = (msg) => {
      console.log("Got message", msg.data);
      const data = JSON.parse(msg.data);

      switch (data.type) {
        case "login":
          this.wsHandleLogin(data.success);
          break;
        //when somebody wants to call us 
        case "offer":
          this.wsHandleOffer(data.offer, data.name);
          break;
        case "answer":
          this.wsHandleAnswer(data.answer);
          break;
        //when a remote peer sends an ice candidate to us 
        case "candidate":
          this.wsHandleCandidate(data.candidate);
          break;
        case "leave":
          this.wsHandleLeave();
          break;
        default:
          console.log(`Message unrecognized`);
          break;
      }
    };

    this.wsConn.onerror = (err) => {
      console.log("Got error", err);
    };

  }









  wsHandleLogin(success) {

    if (success === false) {
      alert("Ooops...try a different username");
    } else {
      this.loggedIn = true;

      //********************** 
      //Starting a peer connection 
      //********************** 

      //using Google public stun server 
      const configuration: RTCConfiguration = {
        "iceServers": [{ "urls": "stun:stun2.1.google.com:19302" }]
      };

      // this.yourConn = new RTCPeerConnection(configuration, { optional: [{ RtpDataChannels: true }] });
      this.rtcConn = new RTCPeerConnection(configuration);

      this.rtcConn.onconnectionstatechange = (ev) => console.log( `onconnectionstatechange: ${ev}` );
      this.rtcConn.onicecandidateerror = (ev) => console.log( `onicecandidateerror ${ev}` );
      this.rtcConn.oniceconnectionstatechange = (ev) => console.log(`oniceconnectionstatechange ${ev}`);
      this.rtcConn.onicegatheringstatechange = (ev) => console.log(`onicegatheringstatechange ${ev}`);
      this.rtcConn.onnegotiationneeded = (ev) => console.log(`onnegotiationneeded ${ev}`);
      this.rtcConn.onsignalingstatechange = (ev) => console.log(`onsignalingstatechange ${ev}`);
      this.rtcConn.onstatsended = (ev) => console.log(`onstatsended ${ev}`);
      this.rtcConn.ontrack = (ev) => console.log(`ontrack ${ev}`);
      
      // this will be called on the callee side
      this.rtcConn.ondatachannel = (ev) => {
        console.log(`ondatachannel: ${ev}`);
        this.dataChannel = ev.channel;
        this.setupDataChannel( this.dataChannel );
      }

      // Setup ice handling 
      // ( get our (external) connection parameters from STUN server )
      this.rtcConn.onicecandidate = (event) => {
        console.log(`onicecandidate`);
        if (event.candidate) {
          this.wsSend({
            type: "candidate",
            candidate: event.candidate
          });
        }
      };

    }
  };


  /**
   * data channel is created on the caller side when calling
   * or assigned on callee side in ondatachannel handler
   * @param dc 
   */
  setupDataChannel(dc: RTCDataChannel ) {

    console.log(dc);

    dc.onopen = (ev) => {
      console.log(`datachannel opened: ${ev}`);
    }

    dc.onerror = (error) => {
      console.log("Ooops...error:", error);
    };

    // when we receive a message from the other peer, display it on the screen 
    dc.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
      const msg = `${this.remoteUsername}: ${event.data}`;
      this.msgs = [msg, ...this.msgs];
    };

    dc.onclose = () => {
      console.log("data channel is closed");
    };
  }


  // when [somebody] sends [us] an [offer] 
  wsHandleOffer(offer, name) {
    this.remoteUsername = name;
    this.rtcConn.setRemoteDescription(new RTCSessionDescription(offer));

    // create an [answer] to an [offer] 
    this.rtcConn.createAnswer()
      .then((answer) => {
        this.rtcConn.setLocalDescription(answer);
        this.wsSend({
          type: "answer",
          answer: answer
        });
      })
      .catch(error => {
        alert("Error when creating an answer");
      });

  };

  // when we got an [answer] from a [remote user]
  wsHandleAnswer(answer) {
    this.rtcConn.setRemoteDescription(new RTCSessionDescription(answer));
  };

  /**
   * When [remote user] send us his [ice candidate]
   * "An ICE candidate describes the protocols and routing needed 
   * for WebRTC to be able to communicate with a remote device."
   * @param candidate 
   */
  wsHandleCandidate(candidate) {
    this.rtcConn.addIceCandidate(new RTCIceCandidate(candidate));
  };

  wsHandleLeave() {
    this.remoteUsername = null;
    this.rtcConn.close();
    this.rtcConn.onicecandidate = null;
  };




  //hang up 
  hangUpBtnClick() {
    this.wsSend({
      type: "leave"
    });
    this.wsHandleLeave();
  }


  // Login when the user clicks the button 
  loginBtnClick( username: string ) {
    this.localUsername = username;
    if (this.localUsername.length > 0) {
      this.wsSend({
        type: "login",
        name: this.localUsername
      });
    }
  }

  // initiating a call 
  callBtnClick( other: string ) {
    // create data channel
    this.dataChannel = this.rtcConn.createDataChannel('s6d5v7ZS5d7zSD');
    this.setupDataChannel( this.dataChannel );

    this.remoteUsername = other;
    if (this.remoteUsername.length > 0) {
      // create an offer 
      this.rtcConn.createOffer()
        .then((offer) => {
          this.wsSend({
            type: "offer",
            offer: offer
          });
          this.rtcConn.setLocalDescription(offer);
        })
        .catch(error => {
          alert("Error when creating an offer");
        });
    }
  }

  // when user clicks the "send message" button 
  sendMsgBtnClick() {
    const msg = `${this.localUsername}: ${this.msgToSend}`;
    this.msgs = [msg, ... this.msgs];

    //sending a message to a connected peer 
    this.dataChannel.send(this.msgToSend);
    this.msgToSend = "";
  }

  // alias for sending JSON encoded messages 
  wsSend(message) {
    //attach the other peer username to our messages
    if (this.remoteUsername) {
      message.name = this.remoteUsername;
    }
    this.wsConn.send(JSON.stringify(message));
  };



}
