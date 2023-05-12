package helper

import (
	"backend/backend/internal/data"
	"fmt"
	"net/http"
)

func WriteResponse(w http.ResponseWriter, status string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"` + status + `"}`))
}

func EnableCors(w *http.ResponseWriter) {
	//(*w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	fmt.Println(w)
}

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

func CheckIfStringExist(table, column, tableData string) bool {
	sqlStmt := "SELECT " + column + " FROM " + table + " WHERE " + column + " = ?;"
	var dummy string

	err := data.DB.QueryRow(sqlStmt, tableData).Scan(&dummy)

	return err == nil
}
