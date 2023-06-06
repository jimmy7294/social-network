package main

import (
	apiGO "backend/backend/internal/apiGo"
	"backend/backend/internal/data"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
)

func runMigrations() {
	migrations := &migrate.FileMigrationSource{
		Dir: "internal/migrations",
	}
	fmt.Println("mig", *migrations)
	n, err := migrate.Exec(data.DB, "sqlite3", migrations, migrate.Up)
	if err != nil {
		fmt.Println("fucke", err)
	}
	fmt.Printf("Applied %d migrations!\n", n)
}

func testhandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Whoa, Go is neat!</h1>")
	fmt.Fprintf(w, "<title>Go</title>")
	fmt.Fprintf(w, "<img src=images/feelsgoodman.png>")
}

// func setupApi sets up the api handlers
// who could have possibly imagined
func setupApi() {
	http.HandleFunc("/api/register", apiGO.Register)
	http.HandleFunc("/api/login", apiGO.Login)
	http.HandleFunc("/api/updateSettings", apiGO.UpdateSettings)
	http.HandleFunc("/api/createPost", apiGO.PostApi)
	http.HandleFunc("/api/cookie", apiGO.CheckCookie)
	http.HandleFunc("/api/getYourImages", apiGO.GetYourImages)
	http.HandleFunc("/api/addImage", apiGO.AddImage)
	http.HandleFunc("/api/getGroupnames", apiGO.GetGroupnames)
	http.HandleFunc("/api/getUsernames", apiGO.GetUsernames)
	img := http.FileServer(http.Dir("internal/images"))
	http.Handle("/images/", http.StripPrefix("/images/", img))
	//http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images"))))
	http.HandleFunc("/test", testhandler)
}

// if only this piece of shit would work the way you wanted it to...
func main() {
	//var db *sql.DB
	_, err := os.Stat("./database/network.db")
	if err != nil {
		fmt.Println("dir not found", err)
		return
	}
	//fmt.Println("file info", hello)
	data.DB, err = sql.Open("sqlite3", "./database/network.db")
	if err != nil {
		fmt.Println("wrong bumbo", err)
		return
	}
	defer data.DB.Close()
	runMigrations()
	/*
		 	migrations := &migrate.FileMigrationSource{
				Dir: "internal/migrations",
			}
			fmt.Println("mig", *migrations)
			n, err := migrate.Exec(data.DB, "sqlite3", migrations, migrate.Up)
			if err != nil {
				fmt.Println("fucke", err)
			}
			fmt.Printf("Applied %d migrations!\n", n)
	*/
	srv := &http.Server{
		Addr: ":8080",
	}
	setupApi()

	fmt.Println("Starting application on port " + srv.Addr)
	if srv.ListenAndServe() != nil {
		log.Fatalf("%v - Internal Server Error", http.StatusInternalServerError)
	}
}
