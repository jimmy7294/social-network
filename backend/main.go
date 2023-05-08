package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/mattn/go-sqlite3"
	migrate "github.com/rubenv/sql-migrate"
)

func main() {
	//var db *sql.DB
	_, err := os.Stat("./database/network.db")
	if err != nil {
		fmt.Println("dir not found", err)
		return
	}
	//fmt.Println("file info", hello)
	db, err := sql.Open("sqlite3", "./database/network.db")
	if err != nil {
		fmt.Println("wrong bumbo", err)
		return
	}

	//fmt.Println(db)
	defer db.Close()
	migrations := &migrate.FileMigrationSource{
		Dir: "internal/migrations",
	}
	fmt.Println("mig", *migrations)
	n, err := migrate.Exec(db, "sqlite3", migrations, migrate.Up)
	if err != nil {
		fmt.Println("fucke", err)
	}
	fmt.Printf("Applied %d migrations!\n", n)
}
