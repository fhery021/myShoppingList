-- CREATE TABLE IF NOT EXISTS shoppingLists(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
-- INSERT or IGNORE INTO developer VALUES (1, 'Simon', '', 'https://pbs.twimg.com/profile_images/858987821394210817/oMccbXv6_bigger.jpg');


--     --  constructor(public id: string, public name: string, public items: Item[]) {

CREATE TABLE IF NOT EXISTS Items(
    ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    notes TEXT,
    isShopped INTEGER
)

CREATE TABLE IF NOT EXISTS shoppingLists(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    FOREIGN KEY(ItemId) REFERENCES Items(ItemId)
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