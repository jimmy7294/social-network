package apiGO

import (
	"backend/backend/internal/helper"
	"net/http"
)

// api that just compares the current session with ones stored in the database
// deleting incorrect sessions should be handled in the frontend since I can't be bothered.
func CheckCookie(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	_, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "incorrect_session")
		return
	}
	helper.WriteResponse(w, "success")
}
