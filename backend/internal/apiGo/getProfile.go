package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type qInfo struct {
	Email string `json:"slug"`
}

type profile struct {
	Email     string   `json:"email"`
	Firstname string   `json:"first_name"`
	Lastname  string   `json:"last_name"`
	DOB       string   `json:"dob"`
	Avatar    string   `json:"avatar"`
	UserName  string   `json:"username"`
	Bio       string   `json:"bio"`
	Privacy   string   `json:"privacy"`
	Followers []string `json:"followers"`
	Following []string `json:"following"`
	Groups    []string `json:"groups"`
}

func getProfileFromDataBase(email string) (profile, error) {
	var usrProfile profile
	sqlStmt := `SELECT email,
	first_name,
	last_name,
	DOB,
	avatar,
	username,
	bio,
	privacy
	FROM users
	WHERE email = ?`
	err := data.DB.QueryRow(sqlStmt, email).Scan(&usrProfile.Email, &usrProfile.Firstname, &usrProfile.Lastname, &usrProfile.DOB, &usrProfile.Avatar, &usrProfile.UserName, &usrProfile.Bio, &usrProfile.Privacy)
	return usrProfile, err
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var eInfo qInfo
		fmt.Println(r.URL.Path)
		err := json.NewDecoder(r.Body).Decode(&eInfo)
		if err != nil {
			fmt.Println(err)
		}
		emailExists := helper.CheckIfStringExist("users", "email", eInfo.Email)
		if !emailExists {
			helper.WriteResponse(w, "user_does_not_exist")
		}
		usrProfile, err := getProfileFromDataBase(eInfo.Email)
		if err != nil {
			fmt.Println("database err", err)
			return
		}
		_ = usrProfile

	}
}
