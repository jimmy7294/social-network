package apiGO

import (
	"backend/backend/internal/helper"
	"fmt"
	"net/http"
)

// api that just compares the current session with ones stored in the database
// deleting incorrect sessions should be handled in the frontend since I can't be bothered.
func CheckCookie(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		cok := r.Cookies()
		fmt.Println("amount of cookies", len(cok))
		_, err := helper.GetIdBySession(w, r)
		if err != nil {
			fmt.Println("cookie check failed")
			helper.WriteResponse(w, "incorrect_session")
			return
		}
		fmt.Println("cookie check successfull", err)
		helper.WriteResponse(w, "success")
	}
}
