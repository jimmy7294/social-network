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
	Status    string   `json:"status"`
}

func getProfileFromDataBase(email string) (profile, int, error) {
	var usrProfile profile
	var uuid int
	sqlStmt := `SELECT uuid,
	email,
	first_name,
	last_name,
	DOB,
	avatar,
	username,
	bio,
	privacy
	FROM users
	WHERE email = ?`
	err := data.DB.QueryRow(sqlStmt, email).Scan(&uuid, &usrProfile.Email, &usrProfile.Firstname, &usrProfile.Lastname, &usrProfile.DOB, &usrProfile.Avatar, &usrProfile.UserName, &usrProfile.Bio, &usrProfile.Privacy)
	return usrProfile, uuid, err
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
			return
		}
		usrProfile, uuid, err := getProfileFromDataBase(eInfo.Email)
		if err != nil {
			fmt.Println("database err", err)
			helper.WriteResponse(w, "profile_error")
			return
		}
		usrProfile.Followers, err = helper.GetFollowing(uuid)
		if err != nil {
			fmt.Println("followers error", err)
			helper.WriteResponse(w, "followers_error")
			return
		}
		usrProfile.Groups, err = helper.GetYourGroups(uuid)
		if err != nil {
			fmt.Println("groups error", err)
			helper.WriteResponse(w, "groups_error")
			return
		}
		usrProfile.Status = "success"
		usrProfileJson, err := json.Marshal(usrProfile)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
		}
		fmt.Println("profile get success")
		w.Header().Set("Content-Type", "application/json")
		w.Write(usrProfileJson)
	}
}
