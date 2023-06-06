package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type user struct {
	Email    string `json:"email"`
	Username string `json:"username"`
}

type users struct {
	User   []user `json:"users"`
	Status string `json:"status"`
}

func getUsernameAndEmail() (users, error) {
	var userDat users
	sqlStmt := `SELECT email,username FROM users`
	rows, err := data.DB.Query(sqlStmt)
	if err != nil {
		return userDat, err
	}
	for rows.Next() {
		var usr user
		err = rows.Scan(usr.Email, usr.Username)
		if err != nil {
			return userDat, err
		}
		userDat.User = append(userDat.User, usr)
	}
	return userDat, nil
}

func GetUsernames(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		userData, err := getUsernameAndEmail()
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
		userDataJson, err := json.Marshal(userData)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(userDataJson)
	}
}
