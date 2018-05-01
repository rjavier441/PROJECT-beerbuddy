USE beerbuddy;
SET SQL_SAFE_UPDATES = 0;

-- Remove any data already in the database
DELETE FROM in_house WHERE bar_id IS NOT NULL;
DELETE FROM common_brand WHERE bar_id IS NOT NULL;
DELETE FROM ingredients WHERE bar_id IS NOT NULL;
DELETE FROM serves WHERE bar_id IS NOT NULL;
DELETE FROM drink WHERE bar_id IS NOT NULL;
DELETE FROM rate_bar WHERE bar_id IS NOT NULL;
DELETE FROM rate_drink WHERE bar_id IS NOT NULL;
DELETE FROM bar_location WHERE bar_id IS NOT NULL;
DELETE FROM bar WHERE username IS NOT NULL;
DELETE FROM bar_owner WHERE username IS NOT NULL;
DELETE FROM user WHERE username IS NOT NULL;

-- Mock User Data
INSERT INTO user (username, birthdate, password)
VALUES 
("chewchewtrain", "1995-08-15", "ee78218389585f5f608b97fca9963a94d6811dbdb2ec31c1b5decf56d27bf39d"),	-- pwd: hichew
("cindywang", "1995-01-01", "d13eb34d074b06ba9a30ed976f437d692be08364ac14ef1fa2c2ab813d9b375c"),	-- pwd: seasickcruise
("huy", "1995-12-12", "da9a0524520e27678b497bbad5f958cac07e1772b7d92530f8fae46df6925298"),	-- pwd: itseasy
("vsingh95", "3005-01-01", "5a75f3b02b5bfcd0db09626d5c16fbe81b894be6045bdd6b7c3ee07fb4270c03"),	-- pwd: pokemonsucks
("rjavier441", "1995-11-04", "4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2");	-- pwd: root

-- Mock Bar Owner Data
INSERT INTO bar_owner (username, owner_name)
VALUES ("huy", "Truonghuy Mai"), ("cindywang", "Cindy Wang");

-- Mock Bar Data
INSERT INTO bar (username, bar_name, bar_id)
VALUES ("huy", "Huy's Hops", 0), ("cindywang", "Five Points", 1);

-- Mock Bar Location Data
INSERT INTO bar_location (bar_id, address, state_name, cityname)
VALUES (0, "1234 Huy Street", "California", "San Jose"), (1, "1 Washington Sq", "California", "San Jose");

-- Mock Drink Data
INSERT INTO drink (bar_id, price, calories, type, alcohol_content, name)
VALUES
(0, 8, 150, "common_brand", 7, "Heineken"),	-- common drinks
(0, 9, 500, "common_brand", 5, "Coors"),
(0, 8, 240, "common_brand", 5, "Miller"),
(0, 6, 230, "common_brand", 7, "Shock Top"),
(0, 15, 320, "common_brand", 13, "Jaegermeister"),
(1, 9, 150, "common_brand", 7, "Heineken"),
(1, 10, 500, "common_brand", 5, "Coors"),
(1, 9, 240, "common_brand", 5, "Miller"),
(1, 7, 230, "common_brand", 7, "Shock Top"),
(1, 19, 320, "common_brand", 13, "Jaegermeister"),
(0, 8, 150, "in_house", 7, "Huy's Heineken"),	-- in-house drinks
(0, 9, 500, "in_house", 5, "AMF"),
(0, 8, 240, "in_house", 5, "Tequila"),
(0, 6, 230, "in_house", 7, "El Diablo"),
(0, 15, 320, "in_house", 13, "Jaeger Bomb"),
(1, 10, 240, "in_house", 25, "Jaeger Nuke"),
(1, 11, 330, "in_house", 19, "Tropical Sunrise"),
(1, 14, 350, "in_house", 34, "Sea Sickness"),
(0, 0, 0, "non-alcoholic", 0, "Water"),
(1, 0, 0, "non-alcoholic", 0, "Water");	-- miscellaneous

-- Mock Ingredients Data
INSERT INTO ingredients (name, bar_id, ing_name)
VALUES
("Water", 0, "Water"),
("Water", 1, "Water"),
("Heineken", 0, "Water"),	-- Huy's Hops Common Brand Drinks
("Heineken", 0, "Wheat"),
("Heineken", 0, "Alcohol"),
("Coors", 0, "Water"),
("Coors", 0, "Wheat"),
("Coors", 0, "Alcohol"),
("Coors", 0, "Garbage"),
("Miller", 0, "Water"),
("Miller", 0, "Wheat"),
("Miller", 0, "Alcohol"),
("Miller", 0, "Garbage"),
("Shock Top", 0, "Water"),
("Shock Top", 0, "Wheat"),
("Shock Top", 0, "Orange Peels"),
("Jaegermeister", 0, "Water"),
("Jaegermeister", 0, "Wheat"),
("Jaegermeister", 0, "Alcohol"),
("Jaegermeister", 0, "Sugar"),
("Heineken", 1, "Water"),	-- Five Points Common Brand Drinks
("Heineken", 1, "Wheat"),
("Heineken", 1, "Alcohol"),
("Coors", 1, "Water"),
("Coors", 1, "Wheat"),
("Coors", 1, "Alcohol"),
("Coors", 1, "Garbage"),
("Miller", 1, "Water"),
("Miller", 1, "Wheat"),
("Miller", 1, "Alcohol"),
("Miller", 1, "Garbage"),
("Shock Top", 1, "Water"),
("Shock Top", 1, "Wheat"),
("Shock Top", 1, "Orange Peels"),
("Jaegermeister", 1, "Water"),
("Jaegermeister", 1, "Wheat"),
("Jaegermeister", 1, "Alcohol"),
("Jaegermeister", 1, "Sugar"),
("Huy's Heineken", 0, "Alcohol"),	-- Huy's Hops In House Drinks
("Huy's Heineken", 0, "Sugar"),
("Huy's Heineken", 0, "Water"),
("Huy's Heineken", 0, "Wheat"),
("Huy's Heineken", 0, "Lemon Juice"),
("AMF", 0, "Tequila"),
("AMF", 0, "Water"),
("AMF", 0, "Orange Juice"),
("AMF", 0, "Lemon Juice"),
("AMF", 0, "Cranberry Juice"),
("Tequila", 0, "Water"),
("Tequila", 0, "Tequila"),
("Tequila", 0, "Lemon"),
("El Diablo", 0, "Absynthe"),
("El Diablo", 0, "Cherry Juice"),
("El Diablo", 0, "Cocktail"),
("El Diablo", 0, "Mint"),
("El Diablo", 0, "Lime Juice"),
("El Diablo", 0, "Salt"),
("Jaeger Bomb", 0, "Jaegermeister"),
("Jaeger Bomb", 0, "Tequila"),
("Jaeger Nuke", 1, "Water"),	-- Five Points In House Drinks
("Jaeger Nuke", 1, "Jaegermeister"),
("Tropical Sunrise", 1, "Orange Juice"),
("Tropical Sunrise", 1, "Agave"),
("Tropical Sunrise", 1, "Wine"),
("Sea Sickness", 1, "Water"),
("Sea Sickness", 1, "Agave"),
("Sea Sickness", 1, "Absynthe")
;

-- Mock Common Brand Drinks
INSERT INTO common_brand (bar_id, name, manufacturer, common_taste)
VALUES
(0, "Heineken", "Heineken Co.", "Watery, just watery"),
(0, "Coors", "Coors Bros.", "Flat"),
(0, "Miller", "Miller Brewers Co.", "Watery and Flat"),
(0, "Shock Top", "Orchard Farms & Co.", "Tangy"),
(0, "Jaegermeister", "Jaegermeister Brewers", "Very strong and distinct scent. Hard liquor."),
(1, "Heineken", "Heineken Co.", "Watery, just watery"),
(1, "Coors", "Coors Bros.", "Flat"),
(1, "Miller", "Miller Brewers Co.", "Watery and Flat"),
(1, "Shock Top", "Orchard Farms & Co.", "Tangy"),
(1, "Jaegermeister", "Jaegermeister Brewers", "Very strong and distinct scent. Hard liquor.");

-- Mock In-House Drinks
INSERT INTO in_house (bar_id, name, in_house_taste)
VALUES
(0,"Huy's Heineken", "Not very different from a regular heineken."),
(0,"AMF", "A great drink for starters. Tastes mildly alcoholic, but sweet."),
(0,"Tequila", "A petron tequila with a touch of lemon."),
(0,"El Diablo", "Fruity, but with lots of alcohol to drown it out."),
(0,"Jaeger Bomb", "A surprisingly tasty drink that isn't too hard for new drinkers."),
(1, "Jaeger Nuke", "A harder liquor with a licorice-like taste."),
(1, "Tropical Sunrise", "A fruity concoction with agave and white wine."),
(1, "Sea Sickness", "A heavily alcoholic drink that tastes like sea water, but with a touch of agave for sweetness.");

-- Mock Serves Data
INSERT INTO serves (name, bar_id, username)
VALUES
("Huy's Heineken", 0, "huy"),	-- Huy's Hops In House Drinks
("AMF", 0, "huy"),
("Tequila", 0, "huy"),
("El Diablo", 0, "huy"),
("Jaeger Bomb", 0, "huy"),
("Jaeger Nuke", 1, "cindywang"),	-- Five Points In House Drinks
("Tropical Sunrise", 1, "cindywang"),
("Sea Sickness", 1, "cindywang"),
("Heineken", 0, "huy"),	-- Huy's Hops Common Brand Drinks
("Coors", 0, "huy"),
("Miller", 0, "huy"),
("Shock Top", 0, "huy"),
("Jaegermeister", 0, "huy"),
("Heineken", 1, "cindywang"),	-- Five Points Common Brand Drinks
("Coors", 1, "cindywang"),
("Miller", 1, "cindywang"),
("Shock Top", 1, "cindywang"),
("Jaegermeister", 1, "cindywang");

-- Mock Rate Bar Data
INSERT INTO rate_bar (bar_id, username,stars)
VALUES
(0, "huy", 5),	-- Huy's Hops Ratings
(0, "rjavier441", 4),
(0, "cindywang", 0),
(0, "vsingh95", 3),
(0, "chewchewtrain", 3),
(1, "huy", 0),	-- Five Points Ratings
(1, "rjavier441", 4),
(1, "cindywang", 5),
(1, "vsingh95", 2),
(1, "chewchewtrain", 1);

-- Mock Rate Drink Data
INSERT INTO rate_drink (bar_id, name, username, stars, taste) VALUES
(0, "Jaeger Bomb", "huy", 5, "The best drink ever!"),
(0, "Jaeger Bomb", "chewchewtrain", 3, "Meh..."),
(0, "Jaeger Bomb", "rjavier441", 0, "Not a fan."),
(0, "El Diablo", "rjavier441", 3, "It's strong"),
(0, "Jaeger Bomb", "vsingh95", 4, "I like it!"),
(0, "El Diablo", "vsingh95", 3, "It's alright..."),
(0, "Jaeger Bomb", "cindywang", 1, "Not as good as mine!"),
(1, "Jaeger Nuke", "cindywang", 5, "Always great!"),
(1, "Sea Sickness", "cindywang", 5, "Not really sickness!"),
(1, "Tropical Sunrise", "huy", 0, "nah, man"),
(1, "Tropical Sunrise", "rjavier441", 5, "Nice flavor!"),
(1, "Water", "chewchewtrain", 5, "Good Ol' Water!");

SET SQL_SAFE_UPDATES = 1;