package data

import "database/sql"

// very important to create an entire package just for a single fucking variable, good job Christoffer!
// (comment written by Christoffer)
var DB *sql.DB
