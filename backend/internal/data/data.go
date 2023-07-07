package data

import (
	"database/sql"
	"time"
)

// very important to create an entire package just for a single fucking variable, good job Christoffer!
// (comment written by Christoffer)
var DB *sql.DB

var SEPERATOR = "*_*"

type UserMessage struct {
	Sender   string    `json:"sender"`
	Receiver string    `json:"reciever"`
	Created  time.Time `json:"created"`
	Image    string    `json:"image"`
	Content  string    `json:"content"`
	Type     string    `json:"type"`
}
