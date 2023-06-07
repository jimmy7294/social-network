package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"fmt"
	"net/http"
	"time"
)

type allposts struct {
	Posts            []posts
	PrivatePosts     []posts
	SemiPrivatePosts []posts
}
type posts struct {
	Author       string
	Image        []byte
	CreationDate time.Time
	Content      string
	Title        string
}

func gatherPosts() ([]posts, error) {
	var pData []posts
	return pData, nil
}

func gatherSemiPrivatePosts(uuid int) ([]posts, error) {
	var pData []posts
	return pData, nil
}

func gatherPrivatePosts(uuid int) ([]posts, error) {
	var pData []posts
	sqlStmt := `SELECT COALESCE(users.username, users.email),
post_image,
creation_date,
post_content,
post_title
FROM posts
JOIN users
ON users.uuid = posts.post_author
WHERE post_privacy = 'private' AND post_author IN (
SELECT uuid
FROM followers
WHERE follower_id = ?
);`
	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		fmt.Println("query error", err)
		return pData, err
	}
	for rows.Next() {
		var privPost posts
		//var authId int
		err = rows.Scan(&privPost.Author, &privPost.Image, &privPost.CreationDate, &privPost.Content, &privPost.Title)
		if err != nil {
			fmt.Println("scan privatePost err", err)
		}
		pData = append(pData, privPost)
	}
	return pData, nil
}

// gathers all posts that a user has access to (normal, private, semi-private etc..)
// seperates the different types of posts and sends them back marshalled
// for now only used for normal posts not group posts
func GetPosts(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "incorrect_session")
			return
		}
		var pData allposts
		/* 		pData.Posts, err = gatherPosts()
		   		if err != nil {
		   			helper.WriteResponse(w, "gatherPosts_error")
		   			return
		   		} */
		pData.PrivatePosts, err = gatherPrivatePosts(uuid)
		if err != nil {
			helper.WriteResponse(w, "gatherPrivatePosts_error")
			return
		}
		/* 		pData.SemiPrivatePosts, err = gatherSemiPrivatePosts(uuid)
		   		if err != nil {
		   			helper.WriteResponse(w, "gatherSemiPrivatePosts_error")
		   			return
		   		} */
		fmt.Println(len(pData.PrivatePosts))
	}
}
