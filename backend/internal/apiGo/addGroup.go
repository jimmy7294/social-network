package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"net/http"
	"time"
)

func addGroupToDB(name, description string, creatorId int) error {
	sqlStmt := `INSERT INTO groups (group_creator,group_name,group_description,creation_date)
	VALUES
	(?,?,?,?)`

	_, err := data.DB.Exec(sqlStmt, creatorId, name, description, time.Now())
	return err
}

func addGroupMemberToDB(uuid int, memberType string) error {
	sqlStmt := `INSERT INTO groupMembers (group_id,uuid,role)
	VALUES
	(?,?,?)`

	_, err := data.DB.Exec(sqlStmt, uuid, memberType)
	return err
}

type groupInfo struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func AddGroup(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var gInfo groupInfo
		err := json.NewDecoder(r.Body).Decode(&gInfo)
		if err != nil {
			helper.WriteResponse(w, "decoding_error")
			return
		}

		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			return
		}

		err = addGroupToDB(gInfo.Name, gInfo.Description, uuid)
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}

		helper.WriteResponse(w, "success")

	}
}
