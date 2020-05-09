/**
 * TODO: api for createRoom, joinRoom, getRoomList, giveMeOwnerOf(roomname)
 */


 /**
  * 
  */
class Signaler {
    wsSignalr: WebSocket;
    constructor (
        username: string,
        handlers: {
            onLogin: () => void,
            onCandidate: (candidate: RTCIceCandidateInit) => void,
            onOffer?: (offer: RTCSessionDescriptionInit, sender: string) => void,
            onAnswer?: (answer: RTCSessionDescriptionInit) => void
        }
    ) {
        this.wsSignalr = new WebSocket('ws://localhost:9090');
        this.wsSignalr.onopen = () => {
            console.log("Connected to the signaling server")
            this.login(username)
        }
		this.wsSignalr.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			switch (data.type) {
                case "login":
                    handlers.onLogin()
                    break
				case "offer": // send by caller, receiver by calee
                    handlers.onOffer(data.offer, data.sendername)
                    break
				case "answer": // send back by calee, received by caller
                    handlers.onAnswer(data.answer)
					break
				// when a remote peer sends an ice candidate to us 
				case "candidate":
					handlers.onCandidate(data.candidate)
					break
				default:
					console.log(`Message unrecognized`)
					break
			}
		};
    }
    private login(username: string) {
        this.wsSend({
            type: "login",
            receiver: username
        });
    }
    logout() {
        this.wsSend({
            type: "leave"
        });
    }
    sendOffer( username: string, offer: RTCSessionDescriptionInit ) {
        this.wsSend({
            receiver: username,
            type: "offer",
            offer: offer
        })
    }
    sendAnswer( username: string, answer: RTCSessionDescriptionInit ) {
        this.wsSend({
            receiver: username,
            type: "answer",
            answer: answer
        })
    }
    sendCandidate( username: string, candidate: RTCIceCandidate ) {
        this.wsSend({
            receiver: username,
            type: "candidate",
            candidate: candidate
        })
    }
    private wsSend = (msg: any) => this.wsSignalr.send( JSON.stringify(msg) )
}


/**
 * 
 */
export interface Peer {
    send: (msg: string) => void
}


/**
 * 
 */
export class Target implements Peer {
    signaler: Signaler
	p2pConn: RTCPeerConnection
	p2pDataChannel: RTCDataChannel
	remoteUsername: string
	constructor( 
        public ourName: string,
        onMessage: (msg: string) => void )
    {
        this.signaler = new Signaler( 
            ourName, {
                onLogin: () => {
                    console.log(`logged in`)
                    // ------ setup webrtc
                    this.p2pConn = new RTCPeerConnection({
                        "iceServers": [{ "urls": "stun:stun2.1.google.com:19302" }]
                    } as RTCConfiguration)
                    this.p2pConn.ondatachannel = (ev) => {
                        console.log(`ondatachannel: ${ev}`)
                        this.p2pDataChannel = ev.channel
                        this.p2pDataChannel.onmessage = (event) => onMessage(event.data)
                        this.p2pDataChannel.onopen =    () => console.log(`dc/opened`)
                    }
                },
                onCandidate: (candidate) => this.p2pConn.addIceCandidate(new RTCIceCandidate(candidate)),
                onOffer: (offer, sender) => {
                    // 0. validate ws_msg, get caller's name
                    this.remoteUsername = sender
                    this.p2pConn.onicecandidate = (event) => // onicecandidate set here 'cus we need remoteUsername
                        {
                            // event.candidate ?? this.signaler.sendCandidate(this.remoteUsername, event.candidate)
                            if ( event.candidate )
                                this.signaler.sendCandidate(this.remoteUsername, event.candidate)
                        }
                    this.p2pConn.setRemoteDescription(new RTCSessionDescription(offer));
                    this.p2pConn.createAnswer()
                        .then( (answer) =>
                            this.p2pConn.setLocalDescription(answer).then( () => 
                                this.signaler.sendAnswer(this.remoteUsername, answer) ) )
                }
            }
        )
    }
    send = ( msg: string ) => this.p2pDataChannel.send(msg)
}


/**
 * 
 */
export class Source implements Peer {
    signaler: Signaler
	p2pConn: RTCPeerConnection
	p2pDataChannel: RTCDataChannel
	constructor( 
        public ourName: string,
        public calleeName: string,
        onMessage: (msg: string) => void )
    {
        this.signaler = new Signaler(
            ourName,
            {
                onLogin: () => {
                    console.log(`logged in`)
                    // ------ setup webrtc
                    this.p2pConn = new RTCPeerConnection({
                        "iceServers": [{ "urls": "stun:stun2.1.google.com:19302" }]
                    } as RTCConfiguration)
                    this.p2pConn.onicecandidate = (event) =>
                        {
                            // event.candidate ?? this.signaler.sendCandidate(this.calleeName, event.candidate)
                            if ( event.candidate )
                                this.signaler.sendCandidate(this.calleeName, event.candidate)
                        }
                    // -- call --
                    const label = `${new Date().getTime()}`
                    this.p2pDataChannel = this.p2pConn.createDataChannel(label)
                    this.p2pDataChannel.onmessage = (event) => onMessage( event.data )
                    this.p2pDataChannel.onopen = () => console.log(`dc/opened`)
                    this.p2pConn.createOffer()
                        .then( (offer) =>
                            this.p2pConn.setLocalDescription(offer).then( () =>
                                this.signaler.sendOffer(this.calleeName, offer) ) )
                },
                onCandidate: (candidate) => this.p2pConn.addIceCandidate(new RTCIceCandidate(candidate)),
                onAnswer: (answer) => this.p2pConn.setRemoteDescription(new RTCSessionDescription(answer))
            }
        )
    }
    send = ( msg: string ) => this.p2pDataChannel.send(msg)
}





/*
this.p2pConn.onicecandidate = (event) => {
    event.candidate ?? this.signaler.candidate(this.remoteUsername, event.candidate)
    if (event.candidate) {
        // Send the candidate to the remote peer
        this.signaler.candidate(this.remoteUsername, event.candidate)
      } else {
        // All ICE candidates have been sent
      }
}
*/