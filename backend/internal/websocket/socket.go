package socket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {return true},
}

var AllClients = make(map[string]*Client)

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w,r,nil)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return conn, nil
}

func NewClient(conn *websocket.Conn, username string) *Client {
	return &Client{
		Username: username,
		Socket: conn,
		Join: make(chan bool),
		Leave: make(chan bool),
		Message: make(chan Message),
	}
}