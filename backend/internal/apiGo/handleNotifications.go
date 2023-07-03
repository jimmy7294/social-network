package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type notificationResponse struct {
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	GroupName string `json:"group_name"`
	Response  string `json:"response"`
}

func addMemberToGroup(member, groupName string) error {
	sqlString := `INSERT INTO groupMembers(group_id,uuid,role)
	SELECT group_id,
	users.uuid,
	'member' AS role
	FROM groups
	JOIN users
	ON users.username = ? OR users.email = ?
	WHERE group_name = ?`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(member, member, groupName)

	return err
}

func deleteGroupNotificationsFromDB(sender, reciever string) error {
	sqlString := `DELETE FROM notifications
	WHERE (sender_id = IN (
		SELECT u.uuid
		FROM users AS u
		WHERE u.username = ? OR u.email = ?
	) AND notif_type = 'group_join_request')
	OR (uuid = IN (
		SELECT u2.uuid
		FROM users AS u2
		WHERE u2.username = ? OR u2.email = ?
	) AND notif_type = 'group_invite')`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(sender, sender, reciever, reciever)

	return err
}

func deleteFollowRequestsFromDB(sender string, reciever int) error {
	sqlString := `DELETE FROM notifications
	WHERE (uuid = ? AND sender_id IN (
		SELECT u.uuid
		FROM users AS u
		WHERE u.email = ? OR u.username = ?
	) AND notif_type = 'follow_request')`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(reciever, sender, sender)
	return err
}

func HandleGroupInvite(w http.ResponseWriter, r *http.Request) {

	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	var notifInfo notificationResponse
	err := json.NewDecoder(r.Body).Decode(&notifInfo)
	if err != nil {
		helper.WriteResponse(w, "decoding_error")
		fmt.Println("decoding", err)
		return
	}

	groupExist := helper.CheckIfStringExist("groups", "group_name", notifInfo.GroupName)
	if !groupExist {
		helper.WriteResponse(w, "group_does_not_exist")
		fmt.Println("group not exist", err)
		return
	}

	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "session_error")
		fmt.Println(err)
		return
	}

	recieveruuid, err := helper.GetuuidFromEmailOrUsername(notifInfo.Receiver)
	if err != nil || uuid != recieveruuid {
		helper.WriteResponse(w, "fucked")
		fmt.Println("user not matching with notification", err)
		return
	}
	if notifInfo.Response == "accept" {
		err = addMemberToGroup(notifInfo.Receiver, notifInfo.GroupName)
		if err != nil {
			helper.WriteResponse(w, "database_error")
			fmt.Println("failed joining group", err)
			return
		}
		err = deleteGroupNotificationsFromDB(notifInfo.Sender, notifInfo.Receiver)
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
	}
	if notifInfo.Response == "decline" {
		err = deleteGroupNotificationsFromDB(notifInfo.Sender, notifInfo.Receiver)
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
	}

	helper.WriteResponse(w, "success")
}

func HandleFollowRequest(w http.ResponseWriter, r *http.Request) {

	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}
}

func HandleGroupJoinRequest(w http.ResponseWriter, r *http.Request) {

	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	var notifInfo notificationResponse
	err := json.NewDecoder(r.Body).Decode(&notifInfo)
	if err != nil {
		helper.WriteResponse(w, "decoding_error")
		fmt.Println("decoding", err)
		return
	}

	groupExist := helper.CheckIfStringExist("groups", "group_name", notifInfo.GroupName)
	if !groupExist {
		helper.WriteResponse(w, "group_does_not_exist")
		fmt.Println("group not exist", err)
		return
	}

	uuid, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "session_error")
		fmt.Println(err)
		return
	}

	isMember, memberType := checkIfGroupMember(notifInfo.GroupName, uuid)
	if !isMember || memberType != "creator" {
		helper.WriteResponse(w, "not_group_creator")
		return
	}

	if notifInfo.Response != "accept" && notifInfo.Response != "decline" {
		helper.WriteResponse(w, "incorrect_response")
		return
	}

	if notifInfo.Response == "accept" {

		_, err := helper.GetuuidFromEmailOrUsername(notifInfo.Sender)
		if err != nil {
			helper.WriteResponse(w, "user_does_not_exist")
			return
		}

		err = addMemberToGroup(notifInfo.Sender, notifInfo.GroupName)
		if err != nil {
			helper.WriteResponse(w, "database_error")
			return
		}
	}

	err = deleteGroupNotificationsFromDB(notifInfo.Sender, notifInfo.Receiver)
	if err != nil {
		helper.WriteResponse(w, "database_error")
		return
	}

	helper.WriteResponse(w, "success")

}
