package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type notification struct {
	Id      int       `json:"id"`
	Content string    `json:"content"`
	Sender  string    `json:"sender"`
	Type    string    `json:"type"`
	Context string    `json:"context"`
	Created time.Time `json:"created"`
}

type allNotifications struct {
	Notifications []notification `json:"notifications"`
	Status        string         `json:"status"`
}

func getAllNotificationsFromDB(uuid int) ([]notification, error) {
	var allNotifications []notification
	sqlString := `SELECT notif_id,
	notif_content,
	creation_date,
	COALESCE(users.username, users.email),
	notif_type,
	notif_context
	FROM notifications
	JOIN users
	ON users.uuid = notifications.sender_id
	WHERE notifications.uuid = ?`
	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return allNotifications, err
	}
	defer sqlStmt.Close()

	rows, err := sqlStmt.Query(uuid)
	if err != nil {
		return allNotifications, err
	}

	defer rows.Close()

	for rows.Next() {
		var userNotification notification

		err = rows.Scan(&userNotification.Id, &userNotification.Content, &userNotification.Created, &userNotification.Sender, &userNotification.Type, &userNotification.Context)
		if err != nil {
			return allNotifications, err
		}

		allNotifications = append(allNotifications, userNotification)
	}

	return allNotifications, err
}

func GetAllNotifications(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "session_error")
		return
	}
	var allUserNotifications allNotifications
	allUserNotifications.Notifications, err = getAllNotificationsFromDB(uuid)
	if err != nil {
		fmt.Println("get notifications error", err)
		helper.WriteResponse(w, "database_error")
		return
	}

	allUserNotifications.Status = "success"

	allUserNotificationsJson, err := json.Marshal(allUserNotifications)
	if err != nil {
		fmt.Println("marshalling error", err)
		helper.WriteResponse(w, "marshalling_error")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(allUserNotificationsJson)
}
