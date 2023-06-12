package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type isFollowing struct {
	Following bool   `json:"following"`
	Status    string `json:"status"`
}

func checkDBIfFollowing(uuid int, email string) bool {
	sqlStmt := `SELECT followers.uuid
	FROM followers
	WHERE follower_id = ? AND followers.uuid IN (
		SELECT uuid
		FROM users
		WHERE email = ?
	);`
	var lole int
	err := data.DB.QueryRow(sqlStmt, uuid, email).Scan(&lole)

	return err == nil
}

func CheckFollowing(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var followInfo isFollowing
		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "incorrect_session")
			return
		}
		var email string
		err = json.NewDecoder(r.Body).Decode(&email)
		if err != nil {
			fmt.Println(err)
			helper.WriteResponse(w, "decoding_error")
		}
		followInfo.Following = checkDBIfFollowing(uuid, email)
		followInfo.Status = "success"

		followInfoJson, err := json.Marshal(followInfo)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
		}
		fmt.Println("checkFollow success")
		w.Header().Set("Content-Type", "application/json")
		w.Write(followInfoJson)
	}
}
