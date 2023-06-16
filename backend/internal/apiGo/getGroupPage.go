package apiGO

import (
	"backend/backend/internal/helper"
	"net/http"
	"time"
)

type event struct {
	Author        string    `json:"author"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	Created       time.Time `json:"created"`
	Options       []string  `json:"options"`
	AlreadyChosen bool      `json:"already_chosen"`
}

type chatMessage struct {
}

type groupPage struct {
	Members      []string      `json:"members"`
	Events       []event       `json:"events"`
	ChatMessages []chatMessage `json:"chat_messages"`
	Status       string        `json:"status"`
}

func GetGroupPage(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {

	}
}
