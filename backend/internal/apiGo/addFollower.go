package apiGO

import (
	"backend/backend/internal/helper"
	"net/http"
)

func addFollower(followerId, followingId int) error {
	return nil
}

func removeFollower(followerId, followingId int) error {
	return nil
}

func AddOrRemoveFollower(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)

	// if r.Method == http.MethodPost {
	// 	yourID, err := helper.GetIdBySession(w, r)

	// }
}
