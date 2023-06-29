package apiGO

import (
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type privateMessage struct {
	Sender   string    `json:"sender"`
	Receiver string    `json:"reciever"`
	Created  time.Time `json:"created"`
	Image    string    `json:"image"`
}

type privateMessages struct {
	Messages []privateMessage `json:"messages"`
	Status   string           `json:"status"`
}

func gatherPrivateMessagesfromDB(yourId int, otherUser string) (privateMessages, error) {
	var MessageData privateMessages
	//sqlStmt := `SELECT `

	return MessageData, nil
}

func GetPrivateMessages(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	var otherUser string
	err := json.NewDecoder(r.Body).Decode(&otherUser)
	if err != nil {
		fmt.Println(err)
		helper.WriteResponse(w, "decoding_error")
		return
	}
	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "session_error")
		return
	}
	privateMessagesData, err := gatherPrivateMessagesfromDB(uuid, otherUser)
	if err != nil {
		helper.WriteResponse(w, "database_error")
		return
	}

	privateMessagesData.Status = "success"
	privateMessagesDataJson, err := json.Marshal(privateMessagesData)
	if err != nil {
		fmt.Println("marshalling error", err)
		helper.WriteResponse(w, "marshalling_error")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(privateMessagesDataJson)

}
