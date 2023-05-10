package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type reg struct {
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Firstname string    `json:"firstName"`
	Lastname  string    `json:"lastName"`
	Birthdate time.Time `json:"birthDate"`
}

func checkEmail(email string) error {
	sqlStmt := `SELECT id FROM users WHERE email = ?;`
	id := -1
	err := data.DB.QueryRow(sqlStmt, email).Scan(id)
	return err
}

func registerUser(regData reg) error {
	sqlStmt, err := data.DB.Prepare(`INSERT INTO users(password, email, firstname, lastname, DOB, privacy) values(?,?,?,?,?,?)`)
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(regData.Password, regData.Email, regData.Firstname, regData.Lastname, regData.Birthdate, "private")
	return err
}

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		return
	}
	var data reg
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(data)
	err = checkEmail(data.Email)
	if err != nil {
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
	helper.WriteResponse(w, "success")
}
