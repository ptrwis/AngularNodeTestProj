import { Component, OnInit, ViewChild } from '@angular/core';

class LocalPeer {
    constructor(
        public configuration: RTCConfiguration
    ) {

    }
    join(roomname: string) { } // connect to peer, owner of roomname
}

class RemotePeer {
    constructor(
        public username: string,
        public dataChannel: RTCDataChannel
    ) {
    }
}

class Server {
    peers: RemotePeer[]
    handleNewPeer() { } // peer connects to us
}




/**
 * 
 */
class Signaler {
    // (connect if necessary)
    registerRoom(roomname: string) { }
    getRoomList() { }


    // connection to signaling server 
    wsSignalr: WebSocket;

    constructor() {
        this.wsSignalr = new WebSocket('ws://localhost:9090');
        this.wsSignalr.onopen = () => console.log("Connected to the signaling server");
        this.wsSignalr.onerror = (err) => console.log("Got error", err);
        //when we got a message from a signaling server 
        this.wsSignalr.onmessage = (msg) => {
            console.log("Got message", msg.data);
            const data = JSON.parse(msg.data);

            switch (data.type) {
                case "login":
                    this.wsHandleLogin(data.success);
                    break;
                // When somebody wants to call us.
                // This is "server"-side.
                case "offer":
                    this.wsHandleOffer(data.offer, data.name);
                    break;
                // we are calling and we have an answer
                case "answer":
                    this.wsHandleAnswer(data.answer);
                    break;
                // When a remote peer sends an ice candidate to us .
                // Ice candidate has some connection parameters
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
    }


    // when [somebody] sends [us] an [offer] 
    wsHandleOffer(offer: RTCSessionDescriptionInit, from: string) {
        this.remoteUsername = from;
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
            .catch(error => alert("Error when creating an answer"));
    };

    // when we got an [answer] from a [remote user]
    wsHandleAnswer(answer: RTCSessionDescriptionInit) {
        this.rtcConn.setRemoteDescription(new RTCSessionDescription(answer));
    };

	/**
    * When [remote user] send us his [ice candidate]
    * "An ICE candidate describes the protocols and routing needed 
    * for WebRTC to be able to communicate with a remote device."
	* @param candidate 
	*/
    wsHandleCandidate(candidate: RTCIceCandidateInit) {
        this.rtcConn.addIceCandidate(new RTCIceCandidate(candidate));
    };

    wsHandleLeave() {
        this.remoteUsername = null;
        this.rtcConn.close();
        this.rtcConn.onicecandidate = null;
    };

    // send msg to signaler
    wsSend(message) {
        //attach the other peer username to our messages
        if (this.remoteUsername) {
            message.name = this.remoteUsername;
        }
        this.wsSignalr.send(JSON.stringify(message));
    };

}



/**
 * 
 */
class WebRtcC {

    localUsername = '';
    remoteUsername = '';
    msgToSend = '';
    msgs: string[] = [];
    loggedIn = false;



    rtcConn: RTCPeerConnection;
    dataChannel: RTCDataChannel;




    /**
     * Signaler responded we are signed in, it's purely out logic
     * @param success 
     */
    wsHandleLogin(success: boolean) {
        if (success === false) {
            alert("Ooops...try a different username");
        } else {
            this.loggedIn = true;
            this.setupWebRTC();
        }
    };


    setupWebRTC() {
        // using Google public stun server 
        const configuration: RTCConfiguration = {
            "iceServers": [{ "urls": "stun:stun2.1.google.com:19302" }]
        };
        // this.yourConn = new RTCPeerConnection(configuration, { optional: [{ RtpDataChannels: true }] });
        this.rtcConn = new RTCPeerConnection(configuration);
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
        // this will be called on the callee side
        this.rtcConn.ondatachannel = (ev) => {
            console.log(`ondatachannel: ${ev}`);
            this.dataChannel = ev.channel;
            this.setupDataChannelHandlers(this.dataChannel);
        }
    }


	/**
     * DataChannel (p2p) event handlers
     * @param dc 
     */
    setupDataChannelHandlers(dc: RTCDataChannel) {
        console.log(dc);
        dc.onopen = (ev) => console.log(`datachannel opened: ${ev}`);
        dc.onclose = (ev) => console.log("data channel is closed");
        dc.onerror = (er) => console.log("Ooops...error:", er);
        // when we receive a message from the other peer, display it on the screen 
        dc.onmessage = (event) => {
            console.log(`Received: ${event.data}`);
            const msg = `${this.remoteUsername}: ${event.data}`;
            this.msgs = [msg, ...this.msgs];
        };
    }




    // hang up 
    hangUpBtnClick() {
        this.wsSend({
            type: "leave"
        });
        this.wsHandleLeave();
    }

    // Login when the user clicks the button 
    loginBtnClick(username: string) {
        this.localUsername = username;
        if (this.localUsername.length > 0) {
            this.wsSend({
                type: "login",
                name: this.localUsername
            });
        }
    }

    // Initiating a call (caller side)
    callBtnClick(other: string) {
        // create data channel
        this.dataChannel = this.rtcConn.createDataChannel('s6d5v7ZS5d7zSD');
        this.setupDataChannelHandlers(this.dataChannel);

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



}
