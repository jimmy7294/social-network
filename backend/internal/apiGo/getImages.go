package apiGO

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"encoding/json"
	"fmt"
	_ "image/png"
	"net/http"
)

func getStockImages() ([]string, error) {
	sqlStmt := `SELECT image_path FROM stockImages`
	rows, err := data.DB.Query(sqlStmt)
	var imgPaths []string
	if err != nil {
		fmt.Println("query error", err)
		return imgPaths, err
	}
	for rows.Next() {
		var imgPath string
		err = rows.Scan(&imgPath)
		if err != nil {
			fmt.Println(err)
		}
		imgPaths = append(imgPaths, imgPath)
	}
	return imgPaths, nil
}

func getUserImages(uuid int) ([]string, error) {
	var imgPaths []string
	sqlStmt := `SELECT image_path FROM userImages WHERE uuid = ?`
	rows, err := data.DB.Query(sqlStmt, uuid)
	if err != nil {
		fmt.Println("query error usrImg", err)
	}
	for rows.Next() {
		var imgPath string
		err = rows.Scan(&imgPath)
		if err != nil {
			fmt.Println(err)
		}
		imgPaths = append(imgPaths, imgPath)
	}
	return imgPaths, nil
}

type images struct {
	StockImages []string `json:"stock_images"`
	UserImages  []string `json:"user_images"`
	Status      string   `json:"status"`
}

func GetYourImages(w http.ResponseWriter, r *http.Request) {
	/* 	fmt.Println("got to images")
	   	imageFile, err := os.Open("../backend/internal/images/feelsgoodman.png")
	   	//backend/internal/images/feelsgoodman.png
	   	if err != nil {
	   		fmt.Println("couldn't open image", err)
	   		return
	   	}
	   	defer imageFile.Close()
	   	imageData, imageType, err := image.DecodeConfig(imageFile)
	   	if err != nil {
	   		fmt.Println("couldn't decode image", err)
	   		return
	   	}
	   	fmt.Println("data", imageData)
	   	fmt.Println("type", imageType) */
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var imgData images
		uuid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "incorrect_session")
			return
		}
		imgData.UserImages, err = getUserImages(uuid)
		if err != nil {
			fmt.Println("userimg err", err)
		}
		imgData.StockImages, err = getStockImages()
		if err != nil {
			fmt.Println("stock img err", err)
		}
		imgData.Status = "success"
		imgDataJson, err := json.Marshal(imgData)
		if err != nil {
			fmt.Println("marshalling error", err)
			helper.WriteResponse(w, "marshalling_error")
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(imgDataJson)
	}

}
