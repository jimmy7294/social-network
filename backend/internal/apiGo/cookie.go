package apiGO

import (
	"backend/backend/internal/helper"
	"net/http"
)

func CheckCookie(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	_, err := helper.GetIdBySession(w, r)
	if err != nil {
		helper.WriteResponse(w, "incorrect_session")
		return
	}
	helper.WriteResponse(w, "success")
}
