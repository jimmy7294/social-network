package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type eventResponse struct {
	GroupName string `json:"group_name"`
	Answer    string `json:"answer"`
	EventId   int    `json:"event_id"`
	Sender    string `json:"sender"`
}

func addEventResponseToDB(eventId int, groupName, choice, userName string) error {
	sqlString := `INSERT INTO eventOptionChoices(event_id,uuid,choice)
	SELECT ? AS event_id,
	? AS choice,
	u.uuid AS uuid
	FROM users AS u
	WHERE u.email = ? OR u.username = ?`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	res, err := sqlStmt.Exec(eventId, choice, userName, userName)
	_ = res

	return nil
}

func HandleEventAnswer(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var response eventResponse

		err := json.NewDecoder(r.Body).Decode(&response)
		if err != nil {
			helper.WriteResponse(w, "decoding_error")
			fmt.Println("decoding event answer", err)
			return
		}

		groupExist := helper.CheckIfStringExist("groups", "group_name", response.GroupName)
		if !groupExist {
			helper.WriteResponse(w, "group_does_not_exist")
			fmt.Println("group not exist", err)
			return
		}

		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			fmt.Println(err)
			return
		}
		isMember, _ := helper.CheckIfGroupMember(response.GroupName, uuid)
		if !isMember {
			helper.WriteResponse(w, "not_a_member")
			return
		}

		receiveruuid, err := helper.GetuuidFromEmailOrUsername(response.Sender)
		if err != nil || uuid != receiveruuid {
			helper.WriteResponse(w, "fucked")
			fmt.Println("user not matching with notification", err)
			return
		}

		helper.WriteResponse(w, "success")
	}
}
