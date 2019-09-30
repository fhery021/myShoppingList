-- CREATE TABLE IF NOT EXISTS developer(
-- id INTEGER PRIMARY KEY AUTOINCREMENT,
-- name TEXT,
-- skills TEXT,
-- img TEXT);

-- CREATE TABLE IF NOT EXISTS product(
-- id INTEGER PRIMARY KEY AUTOINCREMENT,
-- name TEXT,
-- creatorId INTEGER);

--  java.sql.SQLException: sqlite3_prepare_v2 failure: near "name": syntax error
CREATE TABLE items
(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    shoppingListId INTEGER,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    isShopped INTEGER,
    notes TEXT    
)

CREATE TABLE shoppingLists
(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)

-- CREATE TABLE Artists(
--   ArtistId    INTEGER PRIMARY KEY, 
--   ArtistName  TEXT NOT NULL
-- );

-- CREATE TABLE Albums(
--   AlbumId     INTEGER PRIMARY KEY, 
--   AlbumName   TEXT NOT NULL,
--   Year        TEXT NOT NULL,
--   ArtistId INTEGER NOT NULL,
--   FOREIGN KEY(ArtistId) REFERENCES Artists(ArtistId)
-- );