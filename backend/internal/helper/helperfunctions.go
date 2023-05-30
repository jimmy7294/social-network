package helper

import (
	"backend/backend/internal/data"
	"errors"
	"fmt"
	"net/http"
)

// func for writing status messages to frontend
// used for writing error messages in response to fetch requests
func WriteResponse(w http.ResponseWriter, status string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"` + status + `"}`))
}

// can't forget to enable this piece of shit every time you write an api
// it should be an added feature that you can get your imformation stolen / account hacked but noooooo cors won't let that happen...
// lame
func EnableCors(w *http.ResponseWriter) {
	//(*w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	//(*w).Header().Add("Access-Control-Allow-Headers", "Content-Type, withCredentials")
	fmt.Println((*w).Header())
}

// generic function for updating a table
// don't know why it needs to be generic though since it's only being called by one api...
func UpdateTableColumnStringById(table, newData, column string, uid int) error {
	sqlStmt, err := data.DB.Prepare("UPDATE " + table + " SET " + column + " = ? WHERE id = ?;")
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(newData)
	if err != nil {
		return err
	}
	return nil
}

// ctrl + c, ctrl v
// you get it
func UpdateTableColumnByteById(table string, newData []byte, column string, uid int) error {
	sqlStmt, err := data.DB.Prepare("UPDATE " + table + " SET " + column + " = ? WHERE id = ?;")
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(newData)
	if err != nil {
		return err
	}
	return nil
}

// function name says it all really
// and if you somehow don't understand then maybe you should revoke your reading privileges
func GetIdBySession(w http.ResponseWriter, r *http.Request) (int, error) {
	sessionToken, err := r.Cookie("session_token")
	if err != nil {
		return -1, err
	}

	sqlStmt := "SELECT id FROM users WHERE session_token = ?;"
	var uid int

	err = data.DB.QueryRow(sqlStmt, sessionToken).Scan(&uid)
	if err != nil {
		return -1, err
	}
	return uid, nil
}

// checks if a string in a table exists
// pretty self-explanatory shit son
func CheckIfStringExist(table, column, tableData string) bool {
	sqlStmt := "SELECT " + column + " FROM " + table + " WHERE " + column + " = ?;"
	var dummy string

	err := data.DB.QueryRow(sqlStmt, tableData).Scan(&dummy)

	return err == nil
}

// checks if a string in a t̶a̶b̶l̶e̶ username exists
// pretty self-explanatory shit son
func GetUsername(uuid int) (string, error) {
	sqlStmt := "SELECT username,email FROM users WHERE uuid = ?"
	var email, username string
	err := data.DB.QueryRow(sqlStmt, uuid).Scan(&email, &username)
	if err != nil {
		return "", err
	}
	if len(username) > 0 {
		return username, nil
	}
	if len(email) > 0 {
		return email, nil
	}
	return "", errors.New("user not found")
}

// complete fucking shitshow personified that i'm only keeping around because it amuses me
func GetFollowing(uuid int) ([]string, error) {
	sqlStmt := `SELECT followers.uuid, users.username
FROM followers
JOIN users
ON users.uuid = followers.uuid
WHERE follower_id = ?;`
	//JOIN users on followers.uuid = users.uuid
	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		fmt.Println("query error", err)
	}
	for rows.Next() {
		var d1 string
		var d2 string
		var d3 string
		err = rows.Scan(&d1, &d2)
		if err != nil {
			fmt.Println("scan error", err)
		}
		fmt.Println("var1", d1, "var2", d2, "var3", d3)
	}
	var bleh = make([]string, 0)
	return bleh, nil
}
