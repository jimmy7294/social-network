package socket

import (
	//"backend/internal/data"
	// "backend/internal/sqlite"

	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var AllClients = make(map[int]*Client)

var AllGroupChats = make(map[string]map[int]bool)

type Client struct {
	Username     string
	Uuid         int
	Socket       *websocket.Conn
	Join         chan bool
	Leave        chan bool
	GroupMessage chan data.UserMessage
}

func NewClient(conn *websocket.Conn, username string, userId int) *Client {

	return &Client{
		Username:     username,
		Uuid:         userId,
		Socket:       conn,
		Join:         make(chan bool),
		Leave:        make(chan bool),
		GroupMessage: make(chan data.UserMessage),
	}
}

func AddGroupChatUser(groupName string, userId int) error {
	for group := range AllGroupChats {
		if _, ok := AllGroupChats[group][userId]; ok {
			delete(AllGroupChats[group], userId)
		}
	}
	AllGroupChats[groupName][userId] = true
	return nil
}

func deleteUserFromAllGroups(userId int) {
	for group := range AllGroupChats {
		if _, ok := AllGroupChats[group][userId]; ok {
			delete(AllGroupChats[group], userId)
			updateUserlistGroupChat(group)
		}
	}
}

func updateUserlistGroupChat(groupName string) {

	msg := data.UserMessage{}
	msg.Sender = groupName
	msg.Type = "update_group_users"
	msg.Created = time.Now()

	for groupMemberId := range AllGroupChats[groupName] {

		username, err := helper.GetUsername(groupMemberId)
		if err != nil {
			delete(AllGroupChats[groupName], groupMemberId)
		}

		msg.Receiver = username

		if err := AllClients[groupMemberId].Socket.WriteJSON(msg); err != nil {
			fmt.Println("error sending groupchat users update", err)
			AllClients[groupMemberId].Socket.Close()
		}
	}
}

func updateUserlist() {
	msg := data.UserMessage{}
	msg.Sender = "server"
	msg.Receiver = "everyone"
	msg.Created = time.Now()
	msg.Type = "group_message"
	for _, client := range AllClients {
		if err := client.Socket.WriteJSON(msg); err != nil {
			fmt.Println("error at updateUserlist: ", err)
			client.Socket.Close()
		}
	}
}

func AddClient(c *Client) {
	for v := range AllClients {
		if v == c.Uuid {
			discon := AllClients[c.Uuid]
			delete(AllClients, c.Uuid)
			//updateUserlist()
			fmt.Println("removed")
			discon.Socket.Close()
		}
	}
	AllClients[c.Uuid] = c
	//updateUserlist()
	fmt.Printf("current userlist %v \n", AllClients)
	fmt.Println("current groupchat list", AllGroupChats)
}

func (c *Client) Read() {
	defer func() {
		c.Leave <- true
	}()
	for {
		//fmt.Println("users", AllClients)
		msg := data.UserMessage{}
		err := c.Socket.ReadJSON(&msg)
		if err != nil {
			fmt.Println("problem reading message", err, msg, c.Leave, c.Username)
			break
		}
		msg.Created = time.Now()
		msg.Sender = c.Username
		//fmt.Printf(`recieved message %v %v`, msg, c.Leave)
		//fmt.Println()
		if msg.Type == "group_message" {
			c.GroupMessage <- msg
		}
		if msg.Type == "notification" {

		}
		if msg.Type == "private_message" {

		}
		//c.GroupMessage <- msg
	}
	c.Socket.Close()
}

func (c *Client) Write(msg data.UserMessage) {
	if msg.Type == "typing_update" || msg.Type == "update_group_users" {
		return
	}
	err := c.Socket.WriteJSON(msg)
	if err != nil {
		fmt.Println(err)
		c.Socket.Close()
	}
}

func FindAndSend(msg data.UserMessage) {
	//fmt.Println("sending message")

	// _, _, foundUser := sqlite.CheckDataExistence(msg.Recipient, "username")
	// if foundUser && msg.Type == "user_message" {
	// 	AddMsgToTable(msg)
	//}
	recipientId, err := helper.GetuuidFromEmailOrUsername(msg.Receiver)
	if err != nil {
		return
	}
	if val, ok := AllClients[recipientId]; ok {
		//fmt.Printf("receiver found %v %v", val, ok)
		if err := val.Socket.WriteJSON(msg); err != nil {
			fmt.Println("problem sending message", err)
			val.Socket.Close()
		}
	}
}

func FindAndSendToGroup(msg data.UserMessage) {

}

func (c *Client) UpdateClient() {
	for {
		select {
		case <-c.Join:
			//fmt.Println("user joined")
			AddClient(c)
			updateUserlist()
		case <-c.Leave:
			//fmt.Println("user disconnected")
			deleteUserFromAllGroups(c.Uuid)
			delete(AllClients, c.Uuid)
			//updateUserlist()
			//fmt.Printf("current userlist again: %v", AllClients)
		case msg := <-c.GroupMessage:
			fmt.Println("new message", msg)
			//FindAndSend(msg)
			c.Write(msg)
		}
	}
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	//fmt.Println("hello :)")
	fmt.Println("websocket reached")
	fmt.Println(r.URL)

	helper.EnableCors(&w)

	session, err := r.Cookie("session_token")
	if err != nil {
		fmt.Println("websocket; cookie does not exist", err)
		return
	}
	sessionExists := helper.CheckSessionExist(session.Value)
	if !sessionExists {
		fmt.Println("websocket; session not found", err)
		return
	}
	userID, _ := helper.GetIdBySession(w, r)
	//fmt.Println(r.Cookies())
	// session, err := r.Cookie("session_token")
	// if err != nil {
	// 	fmt.Println("error cookies?", err)
	// 	return
	// }
	// uid, err := sqlite.CheckSessionExist(session.Value)
	// if err != nil {
	// 	fmt.Println("got session error", err)
	// 	return
	// }
	// fmt.Println(r.Cookies())
	// username := sqlite.GetUsername(uid)

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err, "error with upgrader")
		return
	}
	c := NewClient(ws, session.Value, userID)
	go c.UpdateClient()
	c.Join <- true
	go c.Read()

}

/*
func AddMsgToTable(msg Message) {
	stmt, err := data.DB.Prepare("INSERT INTO msg(sender,receiver,msg,date) values(?,?,?,?);")
	if err != nil {
		fmt.Println("you're fucked")
	}
	_, err = stmt.Exec(msg.Sender, msg.Recipient, msg.Content, msg.Timestamp)
	if err != nil {
		fmt.Println("problem adding message to table", err)
		fmt.Println("sender: ", msg.Sender, " recipient: ", msg.Recipient, " content: ", msg.Content, " timestamp: ", msg.Timestamp)
	}
}
*/
