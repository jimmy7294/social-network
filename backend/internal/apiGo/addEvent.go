package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

type createEvent struct {
	GroupName string `json:"group_name"`
	Author    int
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	EventDate time.Time `json:"event_date"`
	Options   []string  `json:"options"`
}

func addEventToDB(event createEvent) error {
	sqlStmt := `INSERT INTO events(group_id,event_author,event_title,event_content,creation_date,event_date,options)
	SELECT groups.group_id,
	? AS event_author,
	? AS event_title,
	? AS event_content,
	? AS creation_date,
	? AS event_date,
	? AS options
	FROM groups
	WHERE group_name = ?`

	optionsJoined := strings.Join(event.Options, data.SEPERATOR)
	_, err := data.DB.Exec(sqlStmt, event.Author, event.Title, event.Content, time.Now(), event.EventDate, optionsJoined, event.GroupName)

	return err
}

func AddEvent(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	var eventData createEvent
	err := json.NewDecoder(r.Body).Decode(&eventData)
	if err != nil {
		fmt.Println(err)
	}
	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "incorrect_session")
		return
	}

	isMember, _ := checkIfGroupMember(eventData.GroupName, uuid)
	if !isMember {
		helper.WriteResponse(w, "not_a_member")
		return
	}

	eventData.Author = uuid

	err = addEventToDB(eventData)
	if err != nil {
		fmt.Println("error adding event to db", err)
		helper.WriteResponse(w, "database_error")
		return
	}
	helper.WriteResponse(w, "success")

}
