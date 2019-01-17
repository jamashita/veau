create table captions
(
  caption_id  mediumint unsigned auto_increment
    primary key,
  language_id tinyint unsigned                 not null,
  locale_id   smallint(5) unsigned             not null,
  name        varchar(512) collate utf8mb4_bin not null,
  updated_at  datetime                         not null,
  constraint captions_ibfk_1
    foreign key (language_id) references languages (language_id),
  constraint captions_ibfk_2
    foreign key (locale_id) references locales (locale_id)
);

create index caption_id
  on captions (caption_id);

create index language_id
  on captions (language_id);

create index locale_id
  on captions (locale_id);


create table languages
(
  language_id  tinyint unsigned auto_increment
    primary key,
  name         varchar(20) collate utf8mb4_bin not null,
  english_name varchar(30) collate utf8mb4_bin not null,
  iso639       char(2) collate utf8mb4_bin     not null,
  constraint english_name
    unique (english_name),
  constraint iso639
    unique (iso639)
);

INSERT INTO veau.languages (name, english_name, iso639) VALUES ('аҧсуа бызшәа', 'Abkhazian', 'ab');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Afaraf', 'Afar', 'aa');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Afrikaans', 'Afrikaans', 'af');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Akan', 'Akan', 'ak');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Shqip', 'Albanian', 'sq');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('አማርኛ', 'Amharic', 'am');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('العربية', 'Arabic', 'ar');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('aragonés', 'Aragonese', 'an');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Հայերեն', 'Armenian', 'hy');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('অসমীয়া', 'Assamese', 'as');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('авар мацӀ', 'Avaric', 'av');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('avesta', 'Avestan', 'ae');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('aymar aru', 'Aymara', 'ay');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('azərbaycan dili', 'Azerbaijani', 'az');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('bamanankan', 'Bambara', 'bm');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('башҡорт теле', 'Bashkir', 'ba');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('euskara', 'Basque', 'eu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('беларуская мова', 'Belarusian', 'be');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('বাংলা', 'Bengali', 'bn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('भोजपुरी', 'Bihari languages', 'bh');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Bislama', 'Bislama', 'bi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('bosanski jezik', 'Bosnian', 'bs');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('brezhoneg', 'Breton', 'br');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('български език', 'Bulgarian', 'bg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ဗမာစာ', 'Burmese', 'my');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('català', 'Catalan', 'ca');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Chamoru', 'Chamorro', 'ch');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('нохчийн мотт', 'Chechen', 'ce');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('chiCheŵa', 'Chichewa', 'ny');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('中文', 'Chinese', 'zh');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('чӑваш чӗлхи', 'Chuvash', 'cv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kernewek', 'Cornish', 'kw');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('corsu', 'Corsican', 'co');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ᓀᐦᐃᔭᐍᐏᐣ', 'Cree', 'cr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('hrvatski jezik', 'Croatian', 'hr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('čeština', 'Czech', 'cs');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('dansk', 'Danish', 'da');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ދިވެހި', 'Divehi', 'dv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Nederlands', 'Dutch', 'nl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('རྫོང་ཁ', 'Dzongkha', 'dz');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('English', 'English', 'en');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Esperanto', 'Esperanto', 'eo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('eesti', 'Estonian', 'et');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Eʋegbe', 'Ewe', 'ee');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('føroyskt', 'Faroese', 'fo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('vosa Vakaviti', 'Fijian', 'fj');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('suomi', 'Finnish', 'fi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('français', 'French', 'fr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Fulfulde', 'Fulah', 'ff');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Galego', 'Galician', 'gl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ქართული', 'Georgian', 'ka');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Deutsch', 'German', 'de');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ελληνικά', 'Greek', 'el');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Avañe''ẽ', 'Guaraní', 'gn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ગુજરાતી', 'Gujarati', 'gu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kreyòl ayisyen', 'Haitian', 'ht');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('هَوُسَ', 'Hausa', 'ha');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('עברית', 'Hebrew', 'he');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Otjiherero', 'Herero', 'hz');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('हिन्दी, हिंदी', 'Hindi', 'hi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Hiri Motu', 'Hiri Motu', 'ho');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('magyar', 'Hungarian', 'hu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Interlingua', 'Interlingua', 'ia');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Bahasa Indonesia', 'Indonesian', 'id');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Gaeilge', 'Irish', 'ga');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Asụsụ Igbo', 'Igbo', 'ig');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Iñupiaq', 'Inupiaq', 'ik');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Ido', 'Ido', 'io');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Íslenska', 'Icelandic', 'is');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Italiano', 'Italian', 'it');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ᐃᓄᒃᑎᑐᑦ', 'Inuktitut', 'iu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('日本語', 'Japanese', 'ja');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Basa Jawa', 'Javanese', 'jv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('kalaallisut', 'Kalaallisut', 'kl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ಕನ್ನಡ', 'Kannada', 'kn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kanuri', 'Kanuri', 'kr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('कश्मीरी', 'Kashmiri', 'ks');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('қазақ тілі', 'Kazakh', 'kk');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ខ្មែរ', 'Central Khmer', 'km');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Gĩkũyũ', 'Kikuyu', 'ki');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Ikinyarwanda', 'Kinyarwanda', 'rw');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Кыргызча', 'Kirghiz', 'ky');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('коми кыв', 'Komi', 'kv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kikongo', 'Kongo', 'kg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('한국어', 'Korean', 'ko');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kurdî', 'Kurdish', 'ku');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kuanyama', 'Kuanyama', 'kj');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('latine', 'Latin', 'la');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Lëtzebuergesch', 'Luxembourgish', 'lb');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Luganda', 'Ganda', 'lg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Limburgs', 'Limburgan', 'li');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Lingála', 'Lingala', 'ln');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ພາສາລາວ', 'Lao', 'lo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('lietuvių kalba', 'Lithuanian', 'lt');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kiluba', 'Luba-Katanga', 'lu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('latviešu valoda', 'Latvian', 'lv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Gaelg', 'Manx', 'gv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('македонски јазик', 'Macedonian', 'mk');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('fiteny malagasy', 'Malagasy', 'mg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Bahasa Melayu', 'Malay', 'ms');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('മലയാളം', 'Malayalam', 'ml');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Malti', 'Maltese', 'mt');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('te reo Māori', 'Maori', 'mi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('मराठी', 'Marathi', 'mr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kajin M̧ajeļ', 'Marshallese', 'mh');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Монгол хэл', 'Mongolian', 'mn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Dorerin Naoero', 'Nauru', 'na');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Diné bizaad', 'Navajo, Navaho', 'nv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('isiNdebele', 'North Ndebele', 'nd');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('नेपाली', 'Nepali', 'ne');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Owambo', 'Ndonga', 'ng');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Norsk Bokmål', 'Norwegian Bokmål', 'nb');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Norsk Nynorsk', 'Norwegian Nynorsk', 'nn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Norsk', 'Norwegian', 'no');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ꆈꌠ꒿ Nuosuhxop', 'Sichuan Yi', 'ii');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('isiNdebele', 'South Ndebele', 'nr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('occitan', 'Occitan', 'oc');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ᐊᓂᔑᓈᐯᒧᐎᓐ', 'Ojibwa', 'oj');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ѩзыкъ словѣньскъ', 'Church Slavic', 'cu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Afaan Oromoo', 'Oromo', 'om');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ଓଡ଼ିଆ', 'Oriya', 'or');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ирон æвзаг', 'Ossetian', 'os');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ਪੰਜਾਬੀ', 'Panjabi', 'pa');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('पाऴि', 'Pali', 'pi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('فارسی', 'Persian', 'fa');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('język polski', 'Polish', 'pl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('پښتو', 'Pashto', 'ps');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Português', 'Portuguese', 'pt');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Runa Simi', 'Quechua', 'qu');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Rumantsch Grischun', 'Romansh', 'rm');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Ikirundi', 'Rundi', 'rn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Română', 'Romanian', 'ro');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('русский', 'Russian', 'ru');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('संस्कृतम्', 'Sanskrit', 'sa');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('sardu', 'Sardinian', 'sc');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('सिन्धी', 'Sindhi', 'sd');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Davvisámegiella', 'Northern Sami', 'se');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('gagana fa''a Samoa', 'Samoan', 'sm');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('yângâ tî sängö', 'Sango', 'sg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('српски језик', 'Serbian', 'sr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Gàidhlig', 'Gaelic', 'gd');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('chiShona', 'Shona', 'sn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('සිංහල', 'Sinhala', 'si');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Slovenčina', 'Slovak', 'sk');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Slovenski Jezik', 'Slovene', 'sl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Soomaaliga', 'Somali', 'so');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Sesotho', 'Southern Sotho', 'st');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Español', 'Spanish', 'es');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Basa Sunda', 'Sundanese', 'su');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Kiswahili', 'Swahili', 'sw');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('SiSwati', 'Swati', 'ss');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Svenska', 'Swedish', 'sv');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('தமிழ்', 'Tamil', 'ta');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('తెలుగు', 'Telugu', 'te');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('тоҷикӣ', 'Tajik', 'tg');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ไทย', 'Thai', 'th');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ትግርኛ', 'Tigrinya', 'ti');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('བོད་ཡིག', 'Tibetan', 'bo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Türkmen', 'Turkmen', 'tk');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Wikang Tagalog', 'Tagalog', 'tl');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Setswana', 'Tswana', 'tn');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Faka Tonga', 'Tongan', 'to');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Türkçe', 'Turkish', 'tr');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Xitsonga', 'Tsonga', 'ts');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('татар теле', 'Tatar', 'tt');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Twi', 'Twi', 'tw');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Reo Tahiti', 'Tahitian', 'ty');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ئۇيغۇرچە‎', 'Uighur', 'ug');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Українська', 'Ukrainian', 'uk');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('اردو', 'Urdu', 'ur');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Oʻzbek', 'Uzbek', 'uz');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Tshivenḓa', 'Venda', 've');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Tiếng Việt', 'Vietnamese', 'vi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Volapük', 'Volapük', 'vo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Walon', 'Walloon', 'wa');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Cymraeg', 'Welsh', 'cy');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Wollof', 'Wolof', 'wo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Frysk', 'Western Frisian', 'fy');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('isiXhosa', 'Xhosa', 'xh');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('ייִדיש', 'Yiddish', 'yi');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Yorùbá', 'Yoruba', 'yo');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('Saɯ cueŋƅ', 'Zhuang', 'za');
INSERT INTO veau.languages (name, english_name, iso639) VALUES ('isiZulu', 'Zulu', 'zu');
create table locales
(
  locale_id smallint(5) unsigned auto_increment
    primary key,
  name      varchar(50) collate utf8mb4_bin not null,
  iso3166   char(3) collate utf8mb4_bin     not null,
  constraint name
    unique (name)
);

INSERT INTO veau.locales (name, iso3166) VALUES ('Afghanistan', 'AFG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Albania', 'ALB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Algeria', 'DZA');
INSERT INTO veau.locales (name, iso3166) VALUES ('American Samoa', 'ASM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Andorra', 'AND');
INSERT INTO veau.locales (name, iso3166) VALUES ('Angola', 'AGO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Anguilla', 'AIA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Antarctica', 'ATA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Antigua and Barbuda', 'ATG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Argentina', 'ARG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Armenia', 'ARM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Aruba', 'ABW');
INSERT INTO veau.locales (name, iso3166) VALUES ('Australia', 'AUS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Austria', 'AUT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Azerbaijan', 'AZE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bahamas', 'BHS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bahrain', 'BHR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bangladesh', 'BGD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Barbados', 'BRB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Belarus', 'BLR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Belgium', 'BEL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Belize', 'BLZ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Benin', 'BEN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bermuda', 'BMU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bhutan', 'BTN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bolivia, Plurinational State of', 'BOL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bonaire, Saint Eustatius and Saba', 'BES');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bosnia and Herzegovina', 'BIH');
INSERT INTO veau.locales (name, iso3166) VALUES ('Botswana', 'BWA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bouvet Island', 'BVT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Brazil', 'BRA');
INSERT INTO veau.locales (name, iso3166) VALUES ('British Indian Ocean Territory', 'IOT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Brunei Darussalam', 'BRN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Bulgaria', 'BGR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Burkina Faso', 'BFA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Burundi', 'BDI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cambodia', 'KHM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cameroon', 'CMR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Canada', 'CAN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cape Verde', 'CPV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cayman Islands', 'CYM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Central African Republic', 'CAF');
INSERT INTO veau.locales (name, iso3166) VALUES ('Chad', 'TCD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Chile', 'CHL');
INSERT INTO veau.locales (name, iso3166) VALUES ('China', 'CHN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Christmas Island', 'CXR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cocos (Keeling) Islands', 'CCK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Colombia', 'COL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Comoros', 'COM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Congo', 'COG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Congo, the Democratic Republic of the', 'COD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cook Islands', 'COK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Costa Rica', 'CRI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Croatia', 'HRV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cuba', 'CUB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Curaçao', 'CUW');
INSERT INTO veau.locales (name, iso3166) VALUES ('Cyprus', 'CYP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Czechia', 'CZE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Côte d''Ivoire', 'CIV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Denmark', 'DNK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Djibouti', 'DJI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Dominica', 'DMA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Dominican Republic', 'DOM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Ecuador', 'ECU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Egypt', 'EGY');
INSERT INTO veau.locales (name, iso3166) VALUES ('El Salvador', 'SLV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Equatorial Guinea', 'GNQ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Eritrea', 'ERI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Estonia', 'EST');
INSERT INTO veau.locales (name, iso3166) VALUES ('Ethiopia', 'ETH');
INSERT INTO veau.locales (name, iso3166) VALUES ('Falkland Islands (Malvinas)', 'FLK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Faroe Islands', 'FRO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Fiji', 'FJI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Finland', 'FIN');
INSERT INTO veau.locales (name, iso3166) VALUES ('France', 'FRA');
INSERT INTO veau.locales (name, iso3166) VALUES ('French Guiana', 'GUF');
INSERT INTO veau.locales (name, iso3166) VALUES ('French Polynesia', 'PYF');
INSERT INTO veau.locales (name, iso3166) VALUES ('French Southern Territories', 'ATF');
INSERT INTO veau.locales (name, iso3166) VALUES ('Gabon', 'GAB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Gambia', 'GMB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Georgia', 'GEO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Germany', 'DEU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Ghana', 'GHA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Gibraltar', 'GIB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Greece', 'GRC');
INSERT INTO veau.locales (name, iso3166) VALUES ('Greenland', 'GRL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Grenada', 'GRD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guadeloupe', 'GLP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guam', 'GUM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guatemala', 'GTM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guernsey', 'GGY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guinea', 'GIN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guinea-Bissau', 'GNB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Guyana', 'GUY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Haiti', 'HTI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Heard Island and McDonald Islands', 'HMD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Holy See (Vatican City State)', 'VAT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Honduras', 'HND');
INSERT INTO veau.locales (name, iso3166) VALUES ('Hong Kong', 'HKG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Hungary', 'HUN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Iceland', 'ISL');
INSERT INTO veau.locales (name, iso3166) VALUES ('India', 'IND');
INSERT INTO veau.locales (name, iso3166) VALUES ('Indonesia', 'IDN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Iran, Islamic Republic of', 'IRN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Iraq', 'IRQ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Ireland', 'IRL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Isle of Man', 'IMN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Israel', 'ISR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Italy', 'ITA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Jamaica', 'JAM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Japan', 'JPN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Jersey', 'JEY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Jordan', 'JOR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Kazakhstan', 'KAZ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Kenya', 'KEN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Kiribati', 'KIR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Korea, Democratic People''s Republic of', 'PRK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Korea, Republic of', 'KOR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Kuwait', 'KWT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Kyrgyzstan', 'KGZ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Lao People''s Democratic Republic', 'LAO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Latvia', 'LVA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Lebanon', 'LBN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Lesotho', 'LSO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Liberia', 'LBR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Libya', 'LBY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Liechtenstein', 'LIE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Lithuania', 'LTU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Luxembourg', 'LUX');
INSERT INTO veau.locales (name, iso3166) VALUES ('Macau', 'MAC');
INSERT INTO veau.locales (name, iso3166) VALUES ('Macedonia, the former Yugoslav Republic of', 'MKD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Madagascar', 'MDG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Malawi', 'MWI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Malaysia', 'MYS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Maldives', 'MDV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mali', 'MLI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Malta', 'MLT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Marshall Islands', 'MHL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Martinique', 'MTQ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mauritania', 'MRT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mauritius', 'MUS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mayotte', 'MYT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mexico', 'MEX');
INSERT INTO veau.locales (name, iso3166) VALUES ('Micronesia, Federated States of', 'FSM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Moldova, Republic of', 'MDA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Monaco', 'MCO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mongolia', 'MNG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Montenegro', 'MNE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Montserrat', 'MSR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Morocco', 'MAR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Mozambique', 'MOZ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Myanmar', 'MMR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Namibia', 'NAM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Nauru', 'NRU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Nepal', 'NPL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Netherlands', 'NLD');
INSERT INTO veau.locales (name, iso3166) VALUES ('New Caledonia', 'NCL');
INSERT INTO veau.locales (name, iso3166) VALUES ('New Zealand', 'NZL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Nicaragua', 'NIC');
INSERT INTO veau.locales (name, iso3166) VALUES ('Niger', 'NER');
INSERT INTO veau.locales (name, iso3166) VALUES ('Nigeria', 'NGA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Niue', 'NIU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Norfolk Island', 'NFK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Northern Mariana Islands', 'MNP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Norway', 'NOR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Oman', 'OMN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Pakistan', 'PAK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Palau', 'PLW');
INSERT INTO veau.locales (name, iso3166) VALUES ('Palestinian Territory, Occupied', 'PSE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Panama', 'PAN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Papua New Guinea', 'PNG');
INSERT INTO veau.locales (name, iso3166) VALUES ('Paraguay', 'PRY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Peru', 'PER');
INSERT INTO veau.locales (name, iso3166) VALUES ('Philippines', 'PHL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Pitcairn', 'PCN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Poland', 'POL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Portugal', 'PRT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Puerto Rico', 'PRI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Qatar', 'QAT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Romania', 'ROU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Russian Federation', 'RUS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Rwanda', 'RWA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Réunion', 'REU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Barthélemy', 'BLM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Helena, Ascension and Tristan da Cunha', 'SHN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Kitts and Nevis', 'KNA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Lucia', 'LCA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Martin (French part)', 'MAF');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Pierre and Miquelon', 'SPM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saint Vincent and the Grenadines', 'VCT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Samoa', 'WSM');
INSERT INTO veau.locales (name, iso3166) VALUES ('San Marino', 'SMR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sao Tome and Principe', 'STP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Saudi Arabia', 'SAU');
INSERT INTO veau.locales (name, iso3166) VALUES ('Senegal', 'SEN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Serbia', 'SRB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Seychelles', 'SYC');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sierra Leone', 'SLE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Singapore', 'SGP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sint Maarten (Dutch part)', 'SXM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Slovakia', 'SVK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Slovenia', 'SVN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Solomon Islands', 'SLB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Somalia', 'SOM');
INSERT INTO veau.locales (name, iso3166) VALUES ('South Africa', 'ZAF');
INSERT INTO veau.locales (name, iso3166) VALUES ('South Georgia and the South Sandwich Islands', 'SGS');
INSERT INTO veau.locales (name, iso3166) VALUES ('South Sudan', 'SSD');
INSERT INTO veau.locales (name, iso3166) VALUES ('Spain', 'ESP');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sri Lanka', 'LKA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sudan', 'SDN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Suriname', 'SUR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Svalbard and Jan Mayen', 'SJM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Swaziland', 'SWZ');
INSERT INTO veau.locales (name, iso3166) VALUES ('Sweden', 'SWE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Switzerland', 'CHE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Syrian Arab Republic', 'SYR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Taiwan, Province of China', 'TWN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tajikistan', 'TJK');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tanzania, United Republic of', 'TZA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Thailand', 'THA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Timor-Leste', 'TLS');
INSERT INTO veau.locales (name, iso3166) VALUES ('Togo', 'TGO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tokelau', 'TKL');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tonga', 'TON');
INSERT INTO veau.locales (name, iso3166) VALUES ('Trinidad and Tobago', 'TTO');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tunisia', 'TUN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Turkey', 'TUR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Turkmenistan', 'TKM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Turks and Caicos Islands', 'TCA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Tuvalu', 'TUV');
INSERT INTO veau.locales (name, iso3166) VALUES ('Uganda', 'UGA');
INSERT INTO veau.locales (name, iso3166) VALUES ('Ukraine', 'UKR');
INSERT INTO veau.locales (name, iso3166) VALUES ('United Arab Emirates', 'ARE');
INSERT INTO veau.locales (name, iso3166) VALUES ('United Kingdom', 'GBR');
INSERT INTO veau.locales (name, iso3166) VALUES ('United States', 'USA');
INSERT INTO veau.locales (name, iso3166) VALUES ('United States Minor Outlying Islands', 'UMI');
INSERT INTO veau.locales (name, iso3166) VALUES ('Uruguay', 'URY');
INSERT INTO veau.locales (name, iso3166) VALUES ('Uzbekistan', 'UZB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Vanuatu', 'VUT');
INSERT INTO veau.locales (name, iso3166) VALUES ('Venezuela, Bolivarian Republic of', 'VEN');
INSERT INTO veau.locales (name, iso3166) VALUES ('Viet Nam', 'VNM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Virgin Islands, British', 'VGB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Virgin Islands, U.S.', 'VIR');
INSERT INTO veau.locales (name, iso3166) VALUES ('Wallis and Futuna', 'WLF');
INSERT INTO veau.locales (name, iso3166) VALUES ('Western Sahara', 'ESH');
INSERT INTO veau.locales (name, iso3166) VALUES ('Yemen', 'YEM');
INSERT INTO veau.locales (name, iso3166) VALUES ('Zambia', 'ZMB');
INSERT INTO veau.locales (name, iso3166) VALUES ('Zimbabwe', 'ZWE');
INSERT INTO veau.locales (name, iso3166) VALUES ('Åland Islands', 'ALA');
create table stats
(
  stats_id     int unsigned auto_increment
    primary key,
  caption_id   mediumint unsigned               not null,
  locale_id    smallint(5) unsigned             not null,
  name         varchar(512) collate utf8mb4_bin not null,
  unit         varchar(128) collate utf8mb4_bin not null,
  seq          tinyint unsigned                 not null,
  original_seq tinyint unsigned                 not null,
  constraint stats_ibfk_1
    foreign key (locale_id) references locales (locale_id),
  constraint stats_ibfk_2
    foreign key (caption_id) references captions (caption_id)
);

create index caption_id
  on stats (caption_id);

create index caption_id_2
  on stats (caption_id, seq);

create index locale_id
  on stats (locale_id);


create table stats_items
(
  stats_id int unsigned            not null,
  as_of    datetime                not null,
  value    decimal(24, 7) unsigned not null,
  constraint stats_items_ibfk_1
    foreign key (stats_id) references stats (stats_id)
);

create index stats_id
  on stats_items (stats_id);

