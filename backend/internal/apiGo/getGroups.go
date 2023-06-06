package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type groups struct {
	Groups []string `json:"groups"`
	Status string   `json:"status"`
}

func getGroupnamesFromDB() (groups, error) {
	var groupDat groups
	sqlStmt := `SELECT group_name FROM groups`
	rows, err := data.DB.Query(sqlStmt)
	if err != nil {
		return groupDat, err
	}
	for rows.Next() {
		var grp string
		err = rows.Scan(&grp)
		if err != nil {
			return groupDat, err
		}
		groupDat.Groups = append(groupDat.Groups, grp)
	}
	return groupDat, nil
}

func GetGroupnames(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		groupData, err := getGroupnamesFromDB()
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
		groupDataJson, err := json.Marshal(groupData)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(groupDataJson)
	}
}
