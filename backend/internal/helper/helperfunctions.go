package helper

import (
	"backend/backend/internal/data"
	"fmt"
	"net/http"
	"time"
)

// func for writing status messages to frontend
// used for writing error messages in response to fetch requests
func WriteResponse(w http.ResponseWriter, status string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"` + status + `"}`))
}

// can't forget to enable this piece of shit every time you write an api
// it should be an added feature that you can get your imformation stolen / account hacked but noooooo cors won't let that happen...
// lame
func EnableCors(w *http.ResponseWriter) {
	//(*w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, withCredentials, credentials")
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	//(*w).Header().Add("Access-Control-Allow-Headers", "Content-Type, withCredentials")
	//fmt.Println((*w).Header())
}

// generic function for updating a table
// don't know why it needs to be generic though since it's only being called by one api...
func UpdateTableColumnStringById(table, newData, column string, uid int) error {
	sqlStmt, err := data.DB.Prepare("UPDATE " + table + " SET " + column + " = ? WHERE uuid = ?;")
	if err != nil {
		return err
	}
	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(newData, uid)
	if err != nil {
		return err
	}
	return nil
}

// ctrl + c, ctrl v
// you get it
func UpdateTableColumnByteById(table string, newData []byte, column string, uid int) error {
	sqlStmt, err := data.DB.Prepare("UPDATE " + table + " SET " + column + " = ? WHERE uuid = ?;")
	if err != nil {
		return err
	}
	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(newData, uid)
	if err != nil {
		return err
	}
	return nil
}

// function name says it all really
// and if you somehow don't understand then maybe you should revoke your reading privileges
func GetIdBySession(w http.ResponseWriter, r *http.Request) (int, error) {
	sessionToken, err := r.Cookie("session_token")
	if err != nil {
		fmt.Println("haaaa?", err)
		return -1, err
	}
	sqlStmt := "SELECT uuid FROM users WHERE session_token = ?;"
	var uid int

	err = data.DB.QueryRow(sqlStmt, sessionToken.Value).Scan(&uid)
	if err != nil {
		return -1, err
	}
	return uid, nil
}

// checks if a string in a table exists
// pretty self-explanatory shit son
func CheckIfStringExist(table, column, tableData string) bool {
	sqlStmt := "SELECT " + column + " FROM " + table + " WHERE " + column + " = ?;"
	var dummy string

	err := data.DB.QueryRow(sqlStmt, tableData).Scan(&dummy)

	return err == nil
}

// checks if a string in a t̶a̶b̶l̶e̶ username exists
// pretty self-explanatory shit son
func GetUsername(uuid int) (string, error) {
	sqlString := `SELECT COALESCE(username,email)
	FROM users
	WHERE uuid = ?`
	var username string
	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return "", err
	}
	defer sqlStmt.Close()

	err = sqlStmt.QueryRow(uuid).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, err
}

// complete fucking shitshow personified that i'm only keeping around because it amuses me
func GetFollowing(uuid int) ([]string, error) {
	sqlStmt := `SELECT followers.uuid,
COALESCE(users.username, users.email)
FROM followers
JOIN users
ON users.uuid = followers.uuid
WHERE follower_id = ?;`
	//JOIN users on followers.uuid = users.uuid
	var bleh = make([]string, 0)
	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		fmt.Println("query error", err)
		return bleh, err
	}

	defer rows.Close()

	for rows.Next() {
		var d1 string
		var d2 string
		err = rows.Scan(&d1, &d2)
		if err != nil {
			fmt.Println("scan error", err)
			return bleh, err
		}
		//fmt.Println("var1", d1, "var2", d2)
		bleh = append(bleh, d2)
	}

	return bleh, err
}

func GetFollowers(uuid int) ([]string, error) {
	sqlStmt := `SELECT COALESCE(users.username, users.email)
	FROM followers
	JOIN users
	ON users.uuid = followers.follower_id
	WHERE followers.uuid = ?;`
	var result []string

	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		return result, err
	}

	defer rows.Close()

	for rows.Next() {
		var usr string

		err = rows.Scan(&usr)
		if err != nil {
			return result, err
		}
		result = append(result, usr)
	}

	return result, err
}

func GetYourGroups(uuid int) ([]string, error) {
	sqlStmt := `SELECT groupMembers.group_id,
	groups.group_name
	FROM groupMembers
	JOIN groups
	ON groups.group_id = groupMembers.group_id
	WHERE uuid = ?`
	var res = make([]string, 0)
	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		fmt.Println("query getYourGroups error", err)
	}
	for rows.Next() {
		var temp string
		var useless int
		err = rows.Scan(&useless, &temp)
		if err != nil {
			fmt.Println("scan getYourGroups error", err)
			return res, err
		}
		res = append(res, temp)
	}
	return res, err
}

func GetYourPosts(uuid int) error {
	sqlStmt := `SELECT `
	_ = sqlStmt
	return nil
}
func AddNotificationToDB(content, nType, context string, usr, sender int) error {
	sqlStmt := `INSERT INTO notifications (notif_content,creation_date,uuid,sender_id,notif_type,notif_context)
	VALUES(?,?,?,?,?)
	WHERE NOT EXISTS(
		SELECT 1 FROM notifications
		WHERE uuid = ? AND sender_id = ? AND type = ?
	);`
	_, err := data.DB.Exec(sqlStmt, content, time.Now(), usr, sender, nType, context)
	return err
}

func GetuuidByString(tabType, value string) (int, error) {
	sqlStmt := `SELECT uuid
	FROM users
	WHERE ` + tabType + ` = ?`

	var result int
	err := data.DB.QueryRow(sqlStmt, value).Scan(&result)

	return result, err
}

func GetuuidFromEmailOrUsername(user string) (int, error) {
	sqlString := `SELECT uuid
	FROM users
	WHERE email = ?
	OR username = ?`
	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return 0, err
	}

	defer sqlStmt.Close()

	var uuid int
	err = sqlStmt.QueryRow(user, user).Scan(&uuid)

	return uuid, err
}

func CheckSessionExist(session_token string) bool {
	sqlString := `SELECT uuid
	FROM users
	WHERE session_token = ?`

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return false
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(session_token)

	return err == nil
}

func GetUsernameBySession(session string) (string, error) {
	sqlString := `SELECT COALESCE(username,email)
	FROM users
	WHERE session_token = ?`

	var username string

	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return username, err
	}

	defer sqlStmt.Close()

	err = sqlStmt.QueryRow(session).Scan(&username)

	return username, err
}

func CheckIfGroupMember(groupName string, uuid int) (bool, string) {
	sqlStmt := `SELECT group_id,
	role
	FROM groupMembers
	WHERE groupMembers.uuid = ? AND group_id IN (
		SELECT groups.group_id
		FROM groups
		WHERE groups.group_name = ?
	)`
	var res string
	var dummy int
	err := data.DB.QueryRow(sqlStmt, uuid, groupName).Scan(&dummy, &res)

	return err == nil, res
}

func AddMessageToDB()
