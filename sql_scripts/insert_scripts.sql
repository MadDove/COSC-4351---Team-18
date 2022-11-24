INSERT INTO USER (name, password) VALUE  (
	"MasterUser",
    "1234567"
);

INSERT INTO USER (name, password) VALUE (
	"Jealous User",
    "7654321"
);

INSERT INTO USER (name, password) VALUE (
	"Loving User",
    "Hello, world!"
);

INSERT INTO SONG (title, user_id, album_id, file_path, length_seconds, size) VALUE (
	"First Song",
    (SELECT id from USER where (USER.name = "MasterUser")),
    NULL,
    "/songs/571928308",
    "260",
    "200"
);

INSERT INTO SONG (title, user_id, album_id, file_path, length_seconds, size) VALUE (
	"Second Song",
    (SELECT id from USER where (USER.name = "Loving User")),
    NULL,
    "/songs/501824499",
    "520",
    "1132"
);

INSERT INTO PLAYLIST (title, user_id) VALUE (
	"First Playlist",
    (SELECT id FROM USER WHERE (USER.name = "MasterUser"))
);

INSERT INTO SONG_PLAYLIST (playlist_id, song_id) VALUE(
	1,
    (SELECT id FROM SONG WHERE (SONG.title = "First Song" AND SONG.user_id = 1))
);
    
INSERT INTO RATING (user_id, song_id, rating) VALUE (
	1, 2, 5
);

INSERT INTO RATING (user_id, song_id, rating) VALUE (
	2, 2, 5
);

INSERT INTO RATING (user_id, song_id, rating) VALUE (
	3, 2, 1
);

INSERT INTO PLAYLIST(title, user_id) VALUES
(
	"playlist test to del",
	4
);

INSERT INTO SONG_PLAYLIST (playlist_id, song_id) VALUE(
	3,
    (SELECT s.id FROM SONG s WHERE (s.title = "First Delete Test So"))
);

INSERT INTO ALBUM (title, user_id) VALUES
(	"Album one to testDel", 
	"4"
);

DELETE FROM PLAYLIST
WHERE id = 3;

DELETE FROM SONG
WHERE id = 4;

DELETE FROM ALBUM
WHERE id = 2

DELETE FROM SONG_PLAYLIST
WHERE song_id = 4;

UPDATE SONG
SET album_id = 2
WHERE id = 4;

INSERT INTO USER (name, password)
VALUES ("hey", "hello34");
