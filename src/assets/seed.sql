-- CREATE TABLE IF NOT EXISTS developer(
-- id INTEGER PRIMARY KEY AUTOINCREMENT,
-- name TEXT,
-- skills TEXT,
-- img TEXT);

-- CREATE TABLE IF NOT EXISTS product(
-- id INTEGER PRIMARY KEY AUTOINCREMENT,
-- name TEXT,
-- creatorId INTEGER);


CREATE TABLE
IF NOT EXISTS items
(
    itemId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    isShopped INTEGER,
    notes TEXT,
    shoppingListId INTEGER
)

CREATE TABLE
IF NOT EXISTS shoppingLists
(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
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