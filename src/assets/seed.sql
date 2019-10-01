CREATE TABLE items (
	id	INTEGER NOT NULL PRIMARY KEY,
	shoppingListId	INTEGER,
	itemName	TEXT, 
	quantity	INTEGER,
	unit	TEXT,
	isShopped	INTEGER,
	notes	TEXT
)
;
CREATE TABLE shoppingLists (
	id	INTEGER NOT NULL PRIMARY KEY,
	listName	TEXT
);