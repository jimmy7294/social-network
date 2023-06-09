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
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	EventDate string   `json:"event_date"`
	Options   []string `json:"options"`
}

func sendNotificationToAllGroupMembers(groupName string, yourId int) error {
	sqlString := `INSERT INTO notifications(notif_content,creation_date,uuid,sender_id,notif_type,notif_context)
	SELECT ? AS notif_content,
	? AS creation_date,
	groupMembers.uuid AS uuid,
	? AS sender_id,
	'event' AS notif_type,
	? AS notif_context
	FROM groupMembers
	WHERE groupMembers.uuid NOT IN (?)`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec("A new event has been created in the group"+groupName, time.Now(), yourId, groupName)

	return err
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
	eDate, err := time.Parse("2006-01-02", event.EventDate)
	if err != nil {
		return err
	}
	_, err = data.DB.Exec(sqlStmt, event.Author, event.Title, event.Content, time.Now(), eDate, optionsJoined, event.GroupName)

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
		fmt.Println("decoding error", err)
	}
	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "incorrect_session")
		return
	}

	isMember, _ := helper.CheckIfGroupMember(eventData.GroupName, uuid)
	if !isMember {
		fmt.Println("not a member error", eventData.GroupName, uuid)
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

	err = sendNotificationToAllGroupMembers(eventData.GroupName, uuid)
	if err != nil {
		fmt.Println("sending event notification error", err)
	}

	helper.WriteResponse(w, "success")

}
