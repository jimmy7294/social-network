package helper

import "net/http"

func WriteResponse(w http.ResponseWriter, status string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"` + status + `"}`))
}

func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
}
