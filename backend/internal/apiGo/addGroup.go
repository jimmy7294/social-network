package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"net/http"
	"time"
)

func addGroupToDB(name string, creatorId int) error {
	sqlStmt := `INSERT INTO groups (group_creator,group_name,creation_date)
	VALUES
	(?,?,?)`

	_, err := data.DB.Exec(sqlStmt, creatorId, name, time.Now())
	return err
}

func AddGroup(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var groupName string
		err := json.NewDecoder(r.Body).Decode(&groupName)
		if err != nil {
			helper.WriteResponse(w, "decoding_error")
			return
		}

		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
		}

		err = addGroupToDB(groupName, uuid)
		if err != nil {
			helper.WriteResponse(w, "database_error")
		}

		helper.WriteResponse(w, "success")

	}
}
