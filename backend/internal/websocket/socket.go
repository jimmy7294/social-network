package socket

import (
	//"backend/internal/data"
	// "backend/internal/sqlite"

	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var AllClients = make(map[string]*Client)

type Client struct {
	Username string
	Socket   *websocket.Conn
	Join     chan bool
	Leave    chan bool
	Message  chan Message
}

type Message struct {
	Sender    string    `json:"sender"`
	Recipient string    `json:"recipient"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
	Type      string    `json:"type"`
}

func NewClient(conn *websocket.Conn, username string) *Client {

	return &Client{
		Username: username,
		Socket:   conn,
		Join:     make(chan bool),
		Leave:    make(chan bool),
		Message:  make(chan Message),
	}
}

func updateUserlist() {
	msg := Message{}
	msg.Sender = "server"
	msg.Recipient = "everyone"
	msg.Timestamp = time.Now()
	msg.Type = "update_users"
	for _, client := range AllClients {
		if err := client.Socket.WriteJSON(msg); err != nil {
			fmt.Println("error at updateUserlist: ", err)
			client.Socket.Close()
		}
	}
}

func AddClient(c *Client) {
	for v := range AllClients {
		if v == c.Username {
			discon := AllClients[c.Username]
			delete(AllClients, c.Username)
			updateUserlist()
			fmt.Println("removed")
			discon.Socket.Close()
		}
	}
	AllClients[c.Username] = c
	updateUserlist()
	fmt.Printf("current userlist %v", AllClients)
}

func (c *Client) Read() {
	defer func() {
		c.Leave <- true
	}()
	for {
		fmt.Println("users", AllClients)
		msg := Message{}
		err := c.Socket.ReadJSON(&msg)
		if err != nil {
			fmt.Println("problem reading message", err, msg, c.Leave, c.Username)
			break
		}
		msg.Timestamp = time.Now()
		msg.Sender = c.Username
		fmt.Printf(`recieved message %v %v`, msg, c.Leave)
		fmt.Println()
		c.Message <- msg
	}
	c.Socket.Close()
}

func (c *Client) Write(msg Message) {
	if msg.Type == "typing_update" {
		return
	}
	err := c.Socket.WriteJSON(msg)
	if err != nil {
		fmt.Println(err)
		c.Socket.Close()
	}
}

func FindAndSend(msg Message) {
	fmt.Println("sending message")

	// _, _, foundUser := sqlite.CheckDataExistence(msg.Recipient, "username")
	// if foundUser && msg.Type == "user_message" {
	// 	AddMsgToTable(msg)
	//}

	if val, ok := AllClients[msg.Recipient]; ok {
		fmt.Printf("reciever found %v %v", val, ok)
		if err := val.Socket.WriteJSON(msg); err != nil {
			fmt.Println("problem sending message")
			val.Socket.Close()
		}
	}
}

func (c *Client) UpdateClient() {
	for {
		select {
		case <-c.Join:
			fmt.Println("user joined")
			AddClient(c)
			updateUserlist()
			// 		case <-c.Leave:
			// 			fmt.Println("user disconnected")
			// 			delete(AllClients, c.Username)
			// 			updateUserlist()
			// 			fmt.Printf("current userlist again: %v", AllClients)
			// 		case msg := <-c.Message:
			// 			FindAndSend(msg)
			// 			c.Write(msg)
		}
	}
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hello :)")
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
	c := NewClient(ws, "testuser")
	go c.UpdateClient()
	c.Join <- true
	//go c.Read()

}

/*
func AddMsgToTable(msg Message) {
	stmt, err := data.DB.Prepare("INSERT INTO msg(sender,reciever,msg,date) values(?,?,?,?);")
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
