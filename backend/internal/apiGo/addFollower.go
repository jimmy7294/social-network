package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	socket "backend/backend/internal/websocket"
	"encoding/json"
	"fmt"
	"net/http"
)

func isPrivate(uuid int) bool {
	sqlString := `SELECT privacy
	FROM users
	WHERE uuid = ?`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return false
	}

	defer sqlStmt.Close()

	var res string
	sqlStmt.QueryRow(uuid).Scan(&res)
	return res == "private"
}

func addFollower(followerId int, followedId int) error {

	sqlStmt, err := data.DB.Prepare(`INSERT INTO followers (uuid,follower_id)
	VALUES(?,?)`)
	if err != nil {
		fmt.Println("AUUUUUGHHH", err)
		return err
	}
	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(followedId, followerId)

	return err
}

func removeFollower(followerId int, followedId int) error {
	sqlStmt, err := data.DB.Prepare(`DELETE FROM followers
	WHERE followers.follower_id = ? AND followers.uuid = ?;`)
	if err != nil {
		fmt.Println("gosh darn it", err)
		return err
	}
	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(followerId, followedId)
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
		yourID, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			return
		}

		theirId, err := helper.GetuuidFromEmailOrUsername(email)
		if err != nil || theirId == yourID {
			helper.WriteResponse(w, "incorrect_email")
		}
		//emailExists := helper.CheckIfStringExist("users", "email", email)
		//userNameExists := helper.CheckIfStringExist("users", "username", email)

		//yourEmail, err := getEmailById(yourID)
		//if err != nil {
		//	helper.WriteResponse(w, "session_error")
		//	return
		//}
		/* 		if (!emailExists && !userNameExists) || yourEmail == email {
			fmt.Println("faulty email in add/remove follow", emailExists)
			helper.WriteResponse(w, "incorrect_email")
			return
		} */
		alreadyFollowing := checkDBIfFollowing(yourID, theirId)
		fmt.Println("to follow / unfollow email", email)
		fmt.Println("your id", yourID)
		//fmt.Println("your email", yourEmail)
		if alreadyFollowing {
			err = removeFollower(yourID, theirId)
			fmt.Println("already following")
		} else {
			if isPrivate(theirId) {
				fmt.Println("private lol")
				//theirId, err := helper.GetuuidByString("email", email)
				//if err != nil {
				//	fmt.Println("tfasbjkasfbljkfablsjkbafjsl")
				//	helper.WriteResponse(w, "wrong")
				//	return
				//}
				err = helper.AddNotificationToDB("You have a new Follow request!", "follow_request", "", theirId, yourID)
				if err != nil {
					fmt.Println("addnotif err", err)
				}
				socket.SendNotificationToAUser(yourID, theirId, "You have a new Follow request", "", "follow_request")
			} else {
				err = addFollower(yourID, theirId)
			}
		}
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
		helper.WriteResponse(w, "success")
	}
}
