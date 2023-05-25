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

func setupApi() {
	http.HandleFunc("/api/register", apiGO.Register)
	http.HandleFunc("/api/login", apiGO.Login)
	http.HandleFunc("/api/updateSettings", apiGO.UpdateSettings)
	http.HandleFunc("/api/createPost", apiGO.PostApi)
	http.HandleFunc("/api/cookie", apiGO.CheckCookie)
}

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
