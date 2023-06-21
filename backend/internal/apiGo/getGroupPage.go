package apiGO

import (
	"backend/backend/internal/data"
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

func checkIfGroupMember(groupName string, uuid int) (bool, string) {
	sqlStmt := `SELECT group_id,
	role
	FROM groupMembers
	WHERE groupMembers.uuid = ? AND group_id IN (
		SELECT groups.group_id
		FROM groups
		WHERE groups.group_name = ?
	)`
	var res string
	err := data.DB.QueryRow(sqlStmt, uuid, groupName).Scan(&res)

	return err == nil, res
}

func GetGroupPage(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {

	}
}
