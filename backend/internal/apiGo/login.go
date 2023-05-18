package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gofrs/uuid"
)

func CreateSessionToken(w http.ResponseWriter) string {

	sessionToken := uuid.Must(uuid.NewV4()).String()
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Path:    "/",
		Expires: time.Now().Add(1000000 * time.Second),
	})

	return sessionToken
}

func updateSessionToken(token string, uid int) error {
	sqlStmt, err := data.DB.Prepare("UPDATE users SET session_token = ? WHERE uuid = ?;")
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(token, uid)
	if err != nil {
		return err
	}
	return nil
}

type loginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func checkLoginDetails(email, password string) (bool, int) {
	sqlStmt := "SELECT uuid FROM users WHERE email = ? AND password = ?;"
	var dum int
	err := data.DB.QueryRow(sqlStmt, email, password).Scan(&dum)
	return err == nil, dum
}

func Login(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var logDat loginData
		err := json.NewDecoder(r.Body).Decode(&logDat)
		if err != nil {
			fmt.Println("failed decoding", err)
			return
		}
		if !helper.CheckIfStringExist("users", "email", logDat.Email) {
			helper.WriteResponse(w, "user_not_exist")
			fmt.Println("failed usercheck", err)
			return
		}
		credentialsMatch, uid := checkLoginDetails(logDat.Email, logDat.Password)
		if !credentialsMatch {
			helper.WriteResponse(w, "incorrect_password")
			fmt.Println("failed password check", err, credentialsMatch, uid)
			return
		}
		token := CreateSessionToken(w)
		updateSessionToken(token, uid)
		fmt.Println("it do work")
		helper.WriteResponse(w, "success")
	}
}
