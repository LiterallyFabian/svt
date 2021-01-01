# SVT

### MySQL setup

```
CREATE DATABASE svt;

USE svt;

CREATE TABLE users (name VARCHAR(128), discriminator SMALLINT NOT NULL, access_token VARCHAR(30), refresh_token VARCHAR(30), avatar VARCHAR(128), id VARCHAR(32), bio VARCHAR(512), banner VARCHAR(512), catchScores TEXT);

CREATE TABLE posts (title VARCHAR(64), author VARCHAR(20), text VARCHAR(2500), thumbnailPath VARCHAR(128), url VARCHAR(64), date DATETIME);

CREATE TABLE beatmaps (title VARCHAR(128), artist VARCHAR(128), difficulty VARCHAR(128), thumbnail VARCHAR(128), length SMALLINT, creator VARCHAR(128));
```

### Features

- Publish articles only if logged in
- Sort articles on home feed
- Edit already published articles (before twitter)
- Articles regenerated after template at server start
- svt!catch, written from scratch in javascript
- Support for all osu! beatmaps

### Upcoming
- [x] Homefeed
- [ ] Categories
- [ ] User profile pages
- [x] osu! in javascript


