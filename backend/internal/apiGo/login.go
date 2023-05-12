package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type loginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func checkLoginDetails(email, password string) bool {
	sqlStmt := "SELECT uid FROM user WHERE email = ? AND password = ?;"
	var dum int
	err := data.DB.QueryRow(sqlStmt, email, password).Scan(&dum)
	return err == nil
}

func Login(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var logDat loginData
		err := json.NewDecoder(r.Body).Decode(&logDat)
		if err != nil {
			fmt.Println(err)
			return
		}
		if !helper.CheckIfStringExist("user", "email", logDat.Email) {
			helper.WriteResponse(w, "user_not_exist")
			return
		}
		if !checkLoginDetails(logDat.Email, logDat.Password) {
			helper.WriteResponse(w, "incorrect_password")
			return
		}
		helper.WriteResponse(w, "success")
	}
}
