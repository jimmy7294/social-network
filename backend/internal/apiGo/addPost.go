package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type post struct {
	Type    string   `json:"type"`
	Privacy string   `json:"privacy"`
	Allowed []string `json:"allowed_users"`
	GroupId int      `json:"group_id"`
	Image   []byte   `json:"image"`
	Created string   `json:"creation_date"`
	Content string   `json:"content"`
	Title   string   `json:"title"`
	Author  int
}

func addPostToTable(postData post) error {
	sqlStmt, err := data.DB.Prepare(`INSERT INTO posts(post_author,post_privacy,post_image,creation_date,post_content,post_title) values(?,?,?,?,?,?)`)
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(postData.Author, postData.Privacy, postData.Image, postData.Created, postData.Content, postData.Title)
	return err
}

func addGroupPostToTable(postData post) error {
	sqlStmt, err := data.DB.Prepare(`INSERT INTO groupPosts(gpost_author,group_id,gpost_image,creation_date,gpost_content,gpost_title) values(?,?,?,?,?,?)`)
	if err != nil {
		return err
	}
	_, err = sqlStmt.Exec(postData.Author, postData.GroupId, postData.Image, postData.Created, postData.Content, postData.Title)
	return err
}

// api that takes in a json object and tries to add it in either the group_post or the post table
func PostApi(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var pData post
		err := json.NewDecoder(r.Body).Decode(&pData)
		if err != nil {
			fmt.Println(err)
		}
		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "incorrect_session")
			return
		}
		pData.Author = uuid
		if err != nil {
			helper.WriteResponse(w, "user_not_found")
			return
		}
		if pData.Type == "post" {
			err = addPostToTable(pData)
			if err != nil {
				helper.WriteResponse(w, "incorrect_input")
				return
			}
			if pData.Privacy == "semi_private" {

			}
		} else if pData.Type == "group_post" {
			err = addGroupPostToTable(pData)
			if err != nil {
				helper.WriteResponse(w, "incorrect_input")
				return
			}
		}

	}
}
