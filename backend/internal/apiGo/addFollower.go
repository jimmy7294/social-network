package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

func addFollower(followerId int, email string) error {

	sqlStmt, err := data.DB.Prepare(`INSERT INTO followers (uuid,follower_id)
	SELECT b.uuid,
	a.uuid
	FROM users a
	INNER JOIN users b ON b.email = ?
	WHERE a.uuid = ?`)
	if err != nil {
		fmt.Println("AUUUUUGHHH", err)
		return err
	}
	_, err = sqlStmt.Exec(email, followerId)

	return err
}

func removeFollower(followerId int, email string) error {
	sqlStmt, err := data.DB.Prepare(`DELETE FROM followers
	WHERE followers.follower_id = ? AND followers.uuid IN (
		SELECT users.uuid
		FROM users
		WHERE email = ?
	);`)
	if err != nil {
		fmt.Println("gosh darn it", err)
		return err
	}
	_, err = sqlStmt.Exec(followerId, email)
	return err
}

func AddOrRemoveFollow(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	if r.Method == http.MethodPost {
		var email string
		err := json.NewDecoder(r.Body).Decode(&email)
		if err != nil {
			fmt.Println("add/remove follow decoding error", err)
			fmt.Println(err)
		}
		emailExists := helper.CheckIfStringExist("users", "email", email)

		yourID, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			return
		}
		yourEmail, err := getEmailById(yourID)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			return
		}
		if !emailExists || yourEmail == email {
			fmt.Println("faulty email in add/remove follow")
			helper.WriteResponse(w, "incorrect_email")
			return
		}
		alreadyFollowing := checkDBIfFollowing(yourID, email)
		fmt.Println("to follow / unfollow email", email)
		fmt.Println("your id", yourID)
		fmt.Println("your email", yourEmail)
		if alreadyFollowing {
			err = removeFollower(yourID, email)
		} else {
			err = addFollower(yourID, email)
		}
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
		helper.WriteResponse(w, "success")
	}
}
