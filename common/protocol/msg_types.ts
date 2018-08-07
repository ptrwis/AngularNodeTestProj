/**
 * communication schemes:
 * cmd -> result ( "sign in"->"token" )
 * event -> broadcast ( "turn left", "chat" )
 * cmd -> result -> broadcast ( "create room" -> "ok" -> "room has been created" )
 * 
 * we can code it as:
 * cmd -> [optional result] -> [optional broadcast]
 * request -> [ response ] -> [ event ]
 */

export enum MSG_TYPE 
{ 
    // requests
    SIGNIN, // resp=token, rpc, request has crdentials and response has token/ session id
    SIGNUP, // resp=status
    CHAT_MSG, // resp=void, from peer to server
    CREATE_ROOM, // resp=rommid, rpc, request has parameters and response has room's id(/ip)
    LEAVE_THE_ROOM, // resp=void, peer or server
    JOIN_ROOM, // resp=status
    GET_ROOM_LIST, // resp=roomlist, rpc, response has list of rooms
    ADD,

    // response
    // one type for all responses, client will know the type because 
    // he knows the type of request
    RESPONSE, 

    // broadcast / events
    CHAT_EVENT, // from server to peers
    PEER_LEFT_THE_ROOM, // server to other peers
    PEER_JOINED_THE_ROOM,
    SERVER_MSG,
    ROOM_HAS_BEEN_CREATED, // additionally, new rooms can be singaled by server
    ROOM_HAS_BEEN_CLOSED, // ... same as closing them
}