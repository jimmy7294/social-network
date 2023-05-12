package apiGO

import (
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	"net/http"
)

type settings struct {
	Image    []byte `json:"avatar"`
	Privacy  string `json:"privacy"`
	Nickname string `json:"nickname"`
	AboutMe  string `json:"aboutMe"`
}

func UpdateSettings(w http.ResponseWriter, r *http.Request) {
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		uid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "cookie")
			return
		}

		var settData settings

		err = json.NewDecoder(r.Body).Decode(&settData)

		if err != nil {
			fmt.Println(err)
			helper.WriteResponse(w, "json")
			return
		}

		if len(settData.Nickname) > 0 {
			nameTaken := helper.CheckIfStringExist("user", "nickname", settData.Nickname)
			if nameTaken {
				helper.WriteResponse(w, "name_taken")
				return
			}
			err = helper.UpdateTableColumnStringById("user", settData.Nickname, "nickname", uid)
			if err != nil {
				helper.WriteResponse(w, "nickname")
				return
			}
		}

		if len(settData.AboutMe) > 0 {
			err = helper.UpdateTableColumnStringById("user", settData.AboutMe, "aboutMe", uid)
			if err != nil {
				helper.WriteResponse(w, "aboutMe")
				return
			}
		}

		if len(settData.Image) > 0 {
			err = helper.UpdateTableColumnByteById("user", settData.Image, "avatar", uid)
			if err != nil {
				helper.WriteResponse(w, "image")
				return
			}
		}

		if settData.Privacy == "private" || settData.Privacy == "public" {
			err = helper.UpdateTableColumnStringById("user", settData.Privacy, "privacy", uid)
			if err != nil {
				helper.WriteResponse(w, "privacy")
				return
			}
		}

		helper.WriteResponse(w, "success")

	}
}
