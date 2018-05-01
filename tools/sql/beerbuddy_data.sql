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
INSERT INTO bar (username, bar_name)
VALUES ("huy", "Huy's Hops"), ("cindywang", "Five Points");

-- Mock Bar Location Data
INSERT INTO bar_location (bar_id, address, state_name, cityname)
VALUES (1, "1234 Huy Street", "California", "San Jose"), (2, "1 Washington Sq", "California", "San Jose");

-- Mock Drink Data
INSERT INTO drink (bar_id, price, calories, type, alcohol_content, name)
VALUES
(1, 8, 150, "common_brand", 7, "Heineken"),	-- common drinks
(1, 9, 500, "common_brand", 5, "Coors"),
(1, 8, 240, "common_brand", 5, "Miller"),
(1, 6, 230, "common_brand", 7, "Shock Top"),
(1, 15, 320, "common_brand", 13, "Jaegermeister"),
(2, 9, 150, "common_brand", 7, "Heineken"),
(2, 10, 500, "common_brand", 5, "Coors"),
(2, 9, 240, "common_brand", 5, "Miller"),
(2, 7, 230, "common_brand", 7, "Shock Top"),
(2, 19, 320, "common_brand", 13, "Jaegermeister"),
(1, 8, 150, "in_house", 7, "Huy's Heineken"),	-- in-house drinks
(1, 9, 500, "in_house", 5, "AMF"),
(1, 8, 240, "in_house", 5, "Tequila"),
(1, 6, 230, "in_house", 7, "El Diablo"),
(1, 15, 320, "in_house", 13, "Jaeger Bomb"),
(2, 10, 240, "in_house", 25, "Jaeger Nuke"),
(2, 11, 330, "in_house", 19, "Tropical Sunrise"),
(2, 14, 350, "in_house", 34, "Sea Sickness"),
(1, 0, 0, "non-alcoholic", 0, "Water"),
(2, 0, 0, "non-alcoholic", 0, "Water");	-- miscellaneous

-- Mock Ingredients Data
INSERT INTO ingredients (name, bar_id, ing_name)
VALUES
("Water", 1, "Water"),
("Water", 2, "Water"),
("Heineken", 1, "Water"),	-- Huy's Hops Common Brand Drinks
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
("Heineken", 2, "Water"),	-- Five Points Common Brand Drinks
("Heineken", 2, "Wheat"),
("Heineken", 2, "Alcohol"),
("Coors", 2, "Water"),
("Coors", 2, "Wheat"),
("Coors", 2, "Alcohol"),
("Coors", 2, "Garbage"),
("Miller", 2, "Water"),
("Miller", 2, "Wheat"),
("Miller", 2, "Alcohol"),
("Miller", 2, "Garbage"),
("Shock Top", 2, "Water"),
("Shock Top", 2, "Wheat"),
("Shock Top", 2, "Orange Peels"),
("Jaegermeister", 2, "Water"),
("Jaegermeister", 2, "Wheat"),
("Jaegermeister", 2, "Alcohol"),
("Jaegermeister", 2, "Sugar"),
("Huy's Heineken", 1, "Alcohol"),	-- Huy's Hops In House Drinks
("Huy's Heineken", 1, "Sugar"),
("Huy's Heineken", 1, "Water"),
("Huy's Heineken", 1, "Wheat"),
("Huy's Heineken", 1, "Lemon Juice"),
("AMF", 1, "Tequila"),
("AMF", 1, "Water"),
("AMF", 1, "Orange Juice"),
("AMF", 1, "Lemon Juice"),
("AMF", 1, "Cranberry Juice"),
("Tequila", 1, "Water"),
("Tequila", 1, "Tequila"),
("Tequila", 1, "Lemon"),
("El Diablo", 1, "Absynthe"),
("El Diablo", 1, "Cherry Juice"),
("El Diablo", 1, "Cocktail"),
("El Diablo", 1, "Mint"),
("El Diablo", 1, "Lime Juice"),
("El Diablo", 1, "Salt"),
("Jaeger Bomb", 1, "Jaegermeister"),
("Jaeger Bomb", 1, "Tequila"),
("Jaeger Nuke", 2, "Water"),	-- Five Points In House Drinks
("Jaeger Nuke", 2, "Jaegermeister"),
("Tropical Sunrise", 2, "Orange Juice"),
("Tropical Sunrise", 2, "Agave"),
("Tropical Sunrise", 2, "Wine"),
("Sea Sickness", 2, "Water"),
("Sea Sickness", 2, "Agave"),
("Sea Sickness", 2, "Absynthe")
;

-- Mock Common Brand Drinks
INSERT INTO common_brand (bar_id, name, manufacturer, common_taste)
VALUES
(1, "Heineken", "Heineken Co.", "Watery, just watery"),
(1, "Coors", "Coors Bros.", "Flat"),
(1, "Miller", "Miller Brewers Co.", "Watery and Flat"),
(1, "Shock Top", "Orchard Farms & Co.", "Tangy"),
(1, "Jaegermeister", "Jaegermeister Brewers", "Very strong and distinct scent. Hard liquor."),
(2, "Heineken", "Heineken Co.", "Watery, just watery"),
(2, "Coors", "Coors Bros.", "Flat"),
(2, "Miller", "Miller Brewers Co.", "Watery and Flat"),
(2, "Shock Top", "Orchard Farms & Co.", "Tangy"),
(2, "Jaegermeister", "Jaegermeister Brewers", "Very strong and distinct scent. Hard liquor.");

-- Mock In-House Drinks
INSERT INTO in_house (bar_id, name, in_house_taste)
VALUES
(1,"Huy's Heineken", "Not very different from a regular heineken."),
(1,"AMF", "A great drink for starters. Tastes mildly alcoholic, but sweet."),
(1,"Tequila", "A petron tequila with a touch of lemon."),
(1,"El Diablo", "Fruity, but with lots of alcohol to drown it out."),
(1,"Jaeger Bomb", "A surprisingly tasty drink that isn't too hard for new drinkers."),
(2, "Jaeger Nuke", "A harder liquor with a licorice-like taste."),
(2, "Tropical Sunrise", "A fruity concoction with agave and white wine."),
(2, "Sea Sickness", "A heavily alcoholic drink that tastes like sea water, but with a touch of agave for sweetness.");

-- Mock Serves Data
INSERT INTO serves (name, bar_id, username)
VALUES
("Huy's Heineken", 1, "huy"),	-- Huy's Hops In House Drinks
("AMF", 1, "huy"),
("Tequila", 1, "huy"),
("El Diablo", 1, "huy"),
("Jaeger Bomb", 1, "huy"),
("Jaeger Nuke", 2, "cindywang"),	-- Five Points In House Drinks
("Tropical Sunrise", 2, "cindywang"),
("Sea Sickness", 2, "cindywang"),
("Heineken", 1, "huy"),	-- Huy's Hops Common Brand Drinks
("Coors", 1, "huy"),
("Miller", 1, "huy"),
("Shock Top", 1, "huy"),
("Jaegermeister", 1, "huy"),
("Heineken", 2, "cindywang"),	-- Five Points Common Brand Drinks
("Coors", 2, "cindywang"),
("Miller", 2, "cindywang"),
("Shock Top", 2, "cindywang"),
("Jaegermeister", 2, "cindywang");

-- Mock Rate Bar Data
INSERT INTO rate_bar (bar_id, username,stars)
VALUES
(1, "huy", 5),	-- Huy's Hops Ratings
(1, "rjavier441", 4),
(1, "cindywang", 0),
(1, "vsingh95", 3),
(1, "chewchewtrain", 3),
(2, "huy", 0),	-- Five Points Ratings
(2, "rjavier441", 4),
(2, "cindywang", 5),
(2, "vsingh95", 2),
(2, "chewchewtrain", 1);

-- Mock Rate Drink Data
INSERT INTO rate_drink (bar_id, name, username, stars, taste) VALUES
(1, "Jaeger Bomb", "huy", 5, "The best drink ever!"),
(1, "Jaeger Bomb", "chewchewtrain", 3, "Meh..."),
(1, "Jaeger Bomb", "rjavier441", 0, "Not a fan."),
(1, "El Diablo", "rjavier441", 3, "It's strong"),
(1, "Jaeger Bomb", "vsingh95", 4, "I like it!"),
(1, "El Diablo", "vsingh95", 3, "It's alright..."),
(1, "Jaeger Bomb", "cindywang", 1, "Not as good as mine!"),
(2, "Jaeger Nuke", "cindywang", 5, "Always great!"),
(2, "Sea Sickness", "cindywang", 5, "Not really sickness!"),
(2, "Tropical Sunrise", "huy", 0, "nah, man"),
(2, "Tropical Sunrise", "rjavier441", 5, "Nice flavor!"),
(2, "Water", "chewchewtrain", 5, "Good Ol' Water!");

SET SQL_SAFE_UPDATES = 1;