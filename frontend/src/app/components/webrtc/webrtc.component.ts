import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { Source, Peer, Target } from './callercalee';

@Component({
	selector: 'webrtc',
	templateUrl: './webrtc.component.html'
})
export class WebRtcComponent {

	remotePeer: Peer

	localUsername = '';
	remoteUsername = '';
	msgToSend = '';
	msgs: string[] = [];

	loggedIn = false;

	constructor(public appRef: ApplicationRef) {
		
	}
	
	// hang up (only), keep connection to signaling server
	hangUpBtnClick() {
		
	}


	waitForCallAs( username: string ) {
		// we are the server, people will call us:
		this.remotePeer = new Target(
			username,
			(msg) => {
				this.msgs.push(msg)
				this.appRef.tick()
			}
		)
	}

	call(phoneNumber: string) {
		// 1. centralServer.login( this.username )
		// const phoneNumber = centralServer.giveMeOwnerOf( room.owner.id )
		this.remotePeer = new Source( 
			'caller', // should be already logged in
			phoneNumber, // who do we call
			(msg) => {
				this.msgs.push(msg)
				this.appRef.tick()
			}
		)
		/* this.remotePeer = new Callee(
			phoneNumber,
			(msg) => this.msgs = [ msg, ... this.msgs ]
		) // .call() */
	}

	// when user clicks the "send message" button 
	sendMsgBtnClick() {
		const msg = `${this.localUsername}: ${this.msgToSend}`;
		this.msgs = [msg, ... this.msgs];
		//sending a message to a connected peer 
		this.remotePeer.send(this.msgToSend);
		this.msgToSend = "";
	}


}






/**
 * after:
 * this.rtcConn = new RTCPeerConnection(configuration);
 *
 * this.rtcConn.onconnectionstatechange = 	(ev) => console.log(`onconnectionstatechange: ${ev}`);
 * this.rtcConn.onicecandidateerror = 		(ev) => console.log(`onicecandidateerror ${ev}`);
 * this.rtcConn.oniceconnectionstatechange = (ev) => console.log(`oniceconnectionstatechange ${ev}`);
 * this.rtcConn.onicegatheringstatechange = (ev) => console.log(`onicegatheringstatechange ${ev}`);
 * this.rtcConn.onnegotiationneeded = 		(ev) => console.log(`onnegotiationneeded ${ev}`);
 * this.rtcConn.onsignalingstatechange = 	(ev) => console.log(`onsignalingstatechange ${ev}`);
 * this.rtcConn.onstatsended = 				(ev) => console.log(`onstatsended ${ev}`);
 * this.rtcConn.ontrack = 					(ev) => console.log(`ontrack ${ev}`);
 * */