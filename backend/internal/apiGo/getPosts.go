package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type allposts struct {
	Posts            []posts `json:"posts"`
	PrivatePosts     []posts `json:"private_posts"`
	SemiPrivatePosts []posts `json:"semi_private_posts"`
	Status           string  `json:"status"`
}
type posts struct {
	Author       string    `json:"author"`
	Image        []byte    `json:"image"`
	CreationDate time.Time `json:"creation_date"`
	Content      string    `json:"content"`
	Title        string    `json:"title"`
}

func gatherPosts() ([]posts, error) {
	var pData []posts
	sqlStmt := `SELECT COALESCE(users.username, users.email),
post_image,
creation_date,
post_content,
post_title
FROM posts
JOIN users
ON users.uuid = posts.post_author
WHERE post_privacy = 'public';`
	rows, err := data.DB.Query(sqlStmt)
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

func gatherSemiPrivatePosts(uuid int) ([]posts, error) {
	var pData []posts
	sqlStmt := `SELECT COALESCE(users.username, users.email),
post_image,
creation_date,
post_content,
post_title
FROM posts
JOIN users
ON users.uuid = posts.post_author
WHERE post_privacy = 'semi' AND post_id IN (
SELECT post_id
FROM allowedUsers
WHERE uuid = ?
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
		pData.Posts, err = gatherPosts()
		if err != nil {
			helper.WriteResponse(w, "gatherPosts_error")
			return
		}
		pData.PrivatePosts, err = gatherPrivatePosts(uuid)
		if err != nil {
			helper.WriteResponse(w, "gatherPrivatePosts_error")
			return
		}
		pData.SemiPrivatePosts, err = gatherSemiPrivatePosts(uuid)
		if err != nil {
			helper.WriteResponse(w, "gatherSemiPrivatePosts_error")
			return
		}
		pData.Status = "success"
		pDataJson, err := json.Marshal(pData)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
			return
		}
		fmt.Println("success")
		w.Header().Set("Content-Type", "application/json")
		w.Write(pDataJson)
	}
}
