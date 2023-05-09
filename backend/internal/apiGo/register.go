package apiGO

import "net/http"

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		return
	}
}
