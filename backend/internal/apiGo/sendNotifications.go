package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	socket "backend/backend/internal/websocket"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type groupNotification struct {
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	GroupName string `json:"group_name"`
}

func addGroupJoinNotifToDB(groupName string, yourId int) error {
	sqlString := `INSERT INTO notifications(notif_content,creation_date,uuid,sender_id,notif_type,notif_context)
	SELECT 'A user would like to join your group!' AS notif_content,
	? AS creaton_date,
	groups.group_creator AS a,
	? AS b,
	'group_join_request' AS notif_type,
	? AS notif_context
	FROM groups
	WHERE NOT EXISTS(
		SELECT 1 FROM notifications AS n
		WHERE n.uuid = a
		AND n.sender_id = b
		AND n.notif_type = 'group_join_request'
		AND n.notif_context = ?
	)
	AND group_name = ?;`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(time.Now(), yourId, groupName, groupName, groupName)

	return err
}

func addGroupInviteNotifToDB(groupName, receiver string, yourId int) error {
	sqlString := `INSERT INTO notifications(notif_content,creation_date,uuid,sender_id,notif_type,notif_context)
	SELECT 'You have been invited to join a group' AS notif_content,
	? AS creaton_date,
	users.uuid AS a,
	? AS sender_id,
	'group_invite' AS notif_type,
	? AS notif_context
	FROM users
	WHERE (? = users.username OR ? = users.email)
	AND NOT EXISTS(
		SELECT 1 FROM notifications AS n
		WHERE (n.uuid = a AND n.notif_type = 'group_invite' AND n.notif_context = ?)
	)`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		fmt.Println("error", err)
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(time.Now(), yourId, groupName, receiver, receiver, groupName)
	fmt.Println("error", err)
	return err
}

func SendGroupJoinRequestNotification(w http.ResponseWriter, r *http.Request) {

	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}
	var notifInfo groupNotification
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

	isMember, _ := helper.CheckIfGroupMember(notifInfo.GroupName, uuid)
	if isMember {
		helper.WriteResponse(w, "already_a_member")
		return
	}

	err = addGroupJoinNotifToDB(notifInfo.GroupName, uuid)
	if err != nil {
		helper.WriteResponse(w, "database_error")
		return
	}
	receiverId, err := helper.GetuuidFromEmailOrUsername(notifInfo.Receiver)
	if err != nil {
		helper.WriteResponse(w, "group_leader_died_i_guess")
		return
	}
	err = socket.SendNotificationToAUser(uuid, receiverId, "A user would like to join your group!", notifInfo.GroupName, "group_join_request")
	if err != nil {
		helper.WriteResponse(w, "database_lock_i_guess?")
		return
	}

	helper.WriteResponse(w, "success")
}

func SendGroupInviteNotification(w http.ResponseWriter, r *http.Request) {

	helper.EnableCors(&w)

	if r.Method != http.MethodPost {
		return
	}

	var notifInfo groupNotification
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

	isMember, _ := helper.CheckIfGroupMember(notifInfo.GroupName, uuid)
	if !isMember {
		helper.WriteResponse(w, "not_a_member")
		return
	}

	err = addGroupInviteNotifToDB(notifInfo.GroupName, notifInfo.Receiver, uuid)
	if err != nil {
		helper.WriteResponse(w, "database_error")
		return
	}
	receiverID, err := helper.GetuuidFromEmailOrUsername(notifInfo.Receiver)
	if err != nil {
		helper.WriteResponse(w, "database_error")
		return
	}
	err = socket.SendNotificationToAUser(uuid, receiverID, "You have received a new Group invitation", notifInfo.GroupName, "group_invite")
	if err != nil {
		helper.WriteResponse(w, "database_lock_i_guess?")
		return
	}

	helper.WriteResponse(w, "success")
}
