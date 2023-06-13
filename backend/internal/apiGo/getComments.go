package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type comment struct {
	Author  string    `json:"author"`
	Content string    `json:"content"`
	Image   string    `json:"image_path"`
	Created time.Time `json:"created"`
}
type comments struct {
	AllComments []comment `json:"comments"`
	Status      string    `json:"status"`
}

func gatherCommentsFromDB(postId int) (comments, error) {
	var commentsData comments
	sqlStmt := `SELECT COALESCE(users.username, users.email),
	comment_content,
	comment_image,
	creation_date
	FROM comments
	JOIN users
	ON comment_author = users.uuid
	WHERE post_id = ?`

	rows, err := data.DB.Query(sqlStmt, postId)
	if err != nil {
		return commentsData, err
	}
	for rows.Next() {
		var cData comment
		err = rows.Scan(&cData.Author, &cData.Content, &cData.Image, &cData.Created)
		if err != nil {
			return commentsData, err
		}
		commentsData.AllComments = append(commentsData.AllComments, cData)
	}
	return commentsData, err
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var postId int
		err := json.NewDecoder(r.Body).Decode(&postId)
		if err != nil {
			helper.WriteResponse(w, "decoding_error")
			fmt.Println("decoding error", err)
			return
		}
		commentData, err := gatherCommentsFromDB(postId)
		if err != nil {
			fmt.Println("database error", err)
			helper.WriteResponse(w, "database_error")
			return
		}
		commentData.Status = "success"
		commentDataJson, err := json.Marshal(commentData)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(commentDataJson)
	}
}
