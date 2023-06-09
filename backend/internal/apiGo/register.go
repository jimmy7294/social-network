package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type reg struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstName"`
	Lastname  string `json:"lastName"`
	Birthdate string `json:"birthDate"`
}

func checkEmail(email string) (int, error) {
	sqlStmt := `SELECT uuid FROM users WHERE email = ?;`
	id := -1
	err := data.DB.QueryRow(sqlStmt, email).Scan(&id)
	return id, err
}

func registerUser(regData reg) error {
	sqlStmt, err := data.DB.Prepare(`INSERT INTO users(password, email, first_name, last_name, DOB, privacy) values(?,?,?,?,?,?)`)
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(regData.Password, regData.Email, regData.Firstname, regData.Lastname, regData.Birthdate, "private")
	return err
}

// just registers you...
// i guess it also checks if an email is already taken, but c'mon you should know what the fuck this does just by the name of the function
func Register(w http.ResponseWriter, r *http.Request) {
	//fmt.Println("body before", r.Body)
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var data reg
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("body", r.Body)
		fmt.Println("decoded data from fetch", data)
		_, err = checkEmail(data.Email)
		if err == nil {
			fmt.Println(err)
			helper.WriteResponse(w, "email")
			return
		}
		err = registerUser(data)
		if err != nil {
			fmt.Println(err)
			helper.WriteResponse(w, "database")
			return
		}
		uid, err := checkEmail(data.Email)
		if err != nil {
			fmt.Println("what the fuck", err)
			helper.WriteResponse(w, "database")
			return
		}
		token := CreateSessionToken(w)
		updateSessionToken(token, uid)
		//helper.WriteResponse(w, "success")
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"success", "token":"` + token + `"}`))
	}

}
