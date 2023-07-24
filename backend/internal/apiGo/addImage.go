package apiGO

import (
	"backend/internal/data"
	"backend/internal/helper"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/gif"

	//_ "image/gif"
	"image/jpeg"
	//_ "image/jpeg"
	"image/png"
	//_ "image/png"
	"net/http"
	"os"
	"strings"

	"github.com/gofrs/uuid"
)

func addImageToDB(uuid int, imagePath string) error {
	sqlString := `INSERT INTO userImages(uuid,image_path)
	VALUES
	(?,?)`
	sqlStmt, err := data.DB.Prepare(sqlString)
	if err != nil {
		return err
	}

	defer sqlStmt.Close()

	_, err = sqlStmt.Exec(uuid, imagePath)
	return err
}

func AddImage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("got to addimage")
	helper.EnableCors(&w)
	if r.Method == http.MethodPost {
		var data64 string
		err := json.NewDecoder(r.Body).Decode(&data64)
		if err != nil {
			fmt.Println("decoding error", err)
		}

		yourid, err := helper.GetIdBySession(w, r)
		if err != nil {
			helper.WriteResponse(w, "session_error")
			return
		}

		data2 := strings.Split(data64, ",")
		fmt.Println("len of data", len(data64), len(data2))

		reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(data2[1]))

		//os.Create(uuid.Must(uuid.NewV4()).String())

		//imageData, imageType, err := image.Decode(reader)
		//imgBytes, _ := base64.StdEncoding.DecodeString(data2[1])
		//_, imageType, err := image.Decode(bytes.NewReader(imgBytes))
		if err != nil {
			fmt.Println("well fuck", err)
			return
		}
		//fmt.Println("Format:", imageType, "len")
		currDir, _ := os.Getwd()
		//imgFile, err := os.Create(currDir + "/internal/images/" + uuid.Must(uuid.NewV4()).String() + "." + imageType)
		if err != nil {
			fmt.Println("error lol", err)
			return
		}
		// TODO: fix whatever the fuck this is supposed to be

		randomStringName := uuid.Must(uuid.NewV4()).String()
		switch {
		case strings.Contains(data2[0], "png"):
			imageData, err := png.Decode(reader)
			if err != nil {
				fmt.Println(err)
			}
			randomStringName = randomStringName + ".png"
			imgFile, _ := os.Create(currDir + "/internal/images/" + randomStringName)
			err = png.Encode(imgFile, imageData)
			if err != nil {
				fmt.Println("aaaaaauuuuuughhhh", err)
				return
			}
			//break
		case strings.Contains(data2[0], "jpeg"):
			imageData, err := jpeg.Decode(reader)
			if err != nil {
				fmt.Println(err)
			}
			randomStringName = randomStringName + ".jpeg"
			imgFile, _ := os.Create(currDir + "/internal/images/" + randomStringName)
			err = jpeg.Encode(imgFile, imageData, nil)
			if err != nil {
				fmt.Println("aaaaaauuuuuughhhh", err)
				return
			}
			//break
		case strings.Contains(data2[0], "gif"):
			gifData, err := gif.DecodeAll(reader)
			if err != nil {
				fmt.Println(err)
			}
			randomStringName = randomStringName + ".gif"
			imgFile, _ := os.Create(currDir + "/internal/images/" + randomStringName)
			err = gif.EncodeAll(imgFile, gifData)
			if err != nil {
				fmt.Println("aaaaaauuuuuughhhh", err)
				return
			}
			//break
		default:
			fmt.Println("incorrect type")
			return
		}

		err = addImageToDB(yourid, "http://localhost:8080/images/"+randomStringName)
		if err != nil {
			fmt.Println("error adding image to database", err)
			helper.WriteResponse(w, "database_error")
			return
		}

		//fmt.Println(currDir + "/internal/images/" + "testo" + "." + imageType)
		helper.WriteResponse(w, "success")
	}
}

/*
		fmt.Println("got to images")
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
	  	fmt.Println("type", imageType)
*/
