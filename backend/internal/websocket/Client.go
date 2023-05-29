package socket

import (
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Content string
	Sender string
	Recipient string
	Time time.Time
}

type Client struct {
	Id int //string
	Username   string
	Socket *websocket.Conn
	Join	chan bool
	Leave	chan bool
	Message	chan Message
	IsGroup bool
}

type Group struct {
	Username []Client
	Id int
	Message []Message
}