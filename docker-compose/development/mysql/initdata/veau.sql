# ************************************************************
# Sequel Pro SQL dump
# Version 5426
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.13)
# Database: veau
# Generation Time: 2019-01-17 10:38:06 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table captions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `captions`;

CREATE TABLE `captions` (
  `caption_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `language_id` tinyint(3) unsigned NOT NULL,
  `locale_id` smallint(5) unsigned NOT NULL,
  `name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`caption_id`),
  KEY `caption_id` (`caption_id`),
  KEY `language_id` (`language_id`),
  KEY `locale_id` (`locale_id`),
  CONSTRAINT `captions_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `languages` (`language_id`),
  CONSTRAINT `captions_ibfk_2` FOREIGN KEY (`locale_id`) REFERENCES `locales` (`locale_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table languages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `languages`;

CREATE TABLE `languages` (
  `language_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `english_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `iso639` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`language_id`),
  UNIQUE KEY `english_name` (`english_name`),
  UNIQUE KEY `iso639` (`iso639`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;

INSERT INTO `languages` (`language_id`, `name`, `english_name`, `iso639`)
VALUES
	(1,X'D0B0D2A7D181D183D0B020D0B1D18BD0B7D188D399D0B0',X'41626B68617A69616E',X'6162'),
	(2,X'416661726166',X'41666172',X'6161'),
	(3,X'416672696B61616E73',X'416672696B61616E73',X'6166'),
	(4,X'416B616E',X'416B616E',X'616B'),
	(5,X'5368716970',X'416C62616E69616E',X'7371'),
	(6,X'E18AA0E1889BE188ADE18A9B',X'416D6861726963',X'616D'),
	(7,X'D8A7D984D8B9D8B1D8A8D98AD8A9',X'417261626963',X'6172'),
	(8,X'617261676F6EC3A973',X'417261676F6E657365',X'616E'),
	(9,X'D580D5A1D5B5D5A5D680D5A5D5B6',X'41726D656E69616E',X'6879'),
	(10,X'E0A685E0A6B8E0A6AEE0A780E0A6AFE0A6BCE0A6BE',X'417373616D657365',X'6173'),
	(11,X'D0B0D0B2D0B0D18020D0BCD0B0D186D380',X'417661726963',X'6176'),
	(12,X'617665737461',X'4176657374616E',X'6165'),
	(13,X'61796D617220617275',X'41796D617261',X'6179'),
	(14,X'617AC9997262617963616E2064696C69',X'417A65726261696A616E69',X'617A'),
	(15,X'62616D616E616E6B616E',X'42616D62617261',X'626D'),
	(16,X'D0B1D0B0D188D2A1D0BED180D18220D182D0B5D0BBD0B5',X'426173686B6972',X'6261'),
	(17,X'6575736B617261',X'426173717565',X'6575'),
	(18,X'D0B1D0B5D0BBD0B0D180D183D181D0BAD0B0D18F20D0BCD0BED0B2D0B0',X'42656C6172757369616E',X'6265'),
	(19,X'E0A6ACE0A6BEE0A682E0A6B2E0A6BE',X'42656E67616C69',X'626E'),
	(20,X'E0A4ADE0A58BE0A49CE0A4AAE0A581E0A4B0E0A580',X'426968617269206C616E677561676573',X'6268'),
	(21,X'4269736C616D61',X'4269736C616D61',X'6269'),
	(22,X'626F73616E736B69206A657A696B',X'426F736E69616E',X'6273'),
	(23,X'6272657A686F6E6567',X'427265746F6E',X'6272'),
	(24,X'D0B1D18AD0BBD0B3D0B0D180D181D0BAD0B820D0B5D0B7D0B8D0BA',X'42756C67617269616E',X'6267'),
	(25,X'E18097E18099E180ACE18085E180AC',X'4275726D657365',X'6D79'),
	(26,X'636174616CC3A0',X'436174616C616E',X'6361'),
	(27,X'4368616D6F7275',X'4368616D6F72726F',X'6368'),
	(28,X'D0BDD0BED185D187D0B8D0B9D0BD20D0BCD0BED182D182',X'4368656368656E',X'6365'),
	(29,X'636869436865C5B561',X'4368696368657761',X'6E79'),
	(30,X'E4B8ADE69687',X'4368696E657365',X'7A68'),
	(31,X'D187D391D0B2D0B0D18820D187D397D0BBD185D0B8',X'43687576617368',X'6376'),
	(32,X'4B65726E6577656B',X'436F726E697368',X'6B77'),
	(33,X'636F727375',X'436F72736963616E',X'636F'),
	(34,X'E19380E190A6E19083E194ADE1908DE1908FE190A3',X'43726565',X'6372'),
	(35,X'6872766174736B69206A657A696B',X'43726F617469616E',X'6872'),
	(36,X'C48D65C5A174696E61',X'437A656368',X'6373'),
	(37,X'64616E736B',X'44616E697368',X'6461'),
	(38,X'DE8BDEA8DE88DEACDE80DEA8',X'446976656869',X'6476'),
	(39,X'4E656465726C616E6473',X'4475746368',X'6E6C'),
	(40,X'E0BDA2E0BEABE0BDBCE0BD84E0BC8BE0BD81',X'447A6F6E676B6861',X'647A'),
	(41,X'456E676C697368',X'456E676C697368',X'656E'),
	(42,X'4573706572616E746F',X'4573706572616E746F',X'656F'),
	(43,X'6565737469',X'4573746F6E69616E',X'6574'),
	(44,X'45CA8B65676265',X'457765',X'6565'),
	(45,X'66C3B8726F79736B74',X'4661726F657365',X'666F'),
	(46,X'766F73612056616B6176697469',X'46696A69616E',X'666A'),
	(47,X'73756F6D69',X'46696E6E697368',X'6669'),
	(48,X'6672616EC3A7616973',X'4672656E6368',X'6672'),
	(49,X'46756C66756C6465',X'46756C6168',X'6666'),
	(50,X'47616C65676F',X'47616C696369616E',X'676C'),
	(51,X'E183A5E18390E183A0E18397E183A3E1839AE18398',X'47656F726769616E',X'6B61'),
	(52,X'44657574736368',X'4765726D616E',X'6465'),
	(53,X'CEB5CEBBCEBBCEB7CEBDCEB9CEBACEAC',X'477265656B',X'656C'),
	(54,X'417661C3B16527E1BABD',X'47756172616EC3AD',X'676E'),
	(55,X'E0AA97E0AB81E0AA9CE0AAB0E0AABEE0AAA4E0AB80',X'47756A6172617469',X'6775'),
	(56,X'4B726579C3B26C206179697379656E',X'4861697469616E',X'6874'),
	(57,X'D987D98ED988D98FD8B3D98E',X'4861757361',X'6861'),
	(58,X'D7A2D791D7A8D799D7AA',X'486562726577',X'6865'),
	(59,X'4F746A6968657265726F',X'48657265726F',X'687A'),
	(60,X'E0A4B9E0A4BFE0A4A8E0A58DE0A4A6E0A5802C20E0A4B9E0A4BFE0A482E0A4A6E0A580',X'48696E6469',X'6869'),
	(61,X'48697269204D6F7475',X'48697269204D6F7475',X'686F'),
	(62,X'6D6167796172',X'48756E67617269616E',X'6875'),
	(63,X'496E7465726C696E677561',X'496E7465726C696E677561',X'6961'),
	(64,X'42616861736120496E646F6E65736961',X'496E646F6E657369616E',X'6964'),
	(65,X'476165696C6765',X'4972697368',X'6761'),
	(66,X'4173E1BBA573E1BBA5204967626F',X'4967626F',X'6967'),
	(67,X'49C3B17570696171',X'496E7570696171',X'696B'),
	(68,X'49646F',X'49646F',X'696F'),
	(69,X'C38D736C656E736B61',X'4963656C616E646963',X'6973'),
	(70,X'4974616C69616E6F',X'4974616C69616E',X'6974'),
	(71,X'E19083E19384E19283E1918EE19190E191A6',X'496E756B7469747574',X'6975'),
	(72,X'E697A5E69CACE8AA9E',X'4A6170616E657365',X'6A61'),
	(73,X'42617361204A617761',X'4A6176616E657365',X'6A76'),
	(74,X'6B616C61616C6C69737574',X'4B616C61616C6C69737574',X'6B6C'),
	(75,X'E0B295E0B2A8E0B38DE0B2A8E0B2A1',X'4B616E6E616461',X'6B6E'),
	(76,X'4B616E757269',X'4B616E757269',X'6B72'),
	(77,X'E0A495E0A4B6E0A58DE0A4AEE0A580E0A4B0E0A580',X'4B6173686D697269',X'6B73'),
	(78,X'D29BD0B0D0B7D0B0D29B20D182D196D0BBD196',X'4B617A616B68',X'6B6B'),
	(79,X'E19E81E19F92E19E98E19F82E19E9A',X'43656E7472616C204B686D6572',X'6B6D'),
	(80,X'47C4A96BC5A979C5A9',X'4B696B757975',X'6B69'),
	(81,X'496B696E79617277616E6461',X'4B696E79617277616E6461',X'7277'),
	(82,X'D09AD18BD180D0B3D18BD0B7D187D0B0',X'4B69726768697A',X'6B79'),
	(83,X'D0BAD0BED0BCD0B820D0BAD18BD0B2',X'4B6F6D69',X'6B76'),
	(84,X'4B696B6F6E676F',X'4B6F6E676F',X'6B67'),
	(85,X'ED959CEAB5ADEC96B4',X'4B6F7265616E',X'6B6F'),
	(86,X'4B757264C3AE',X'4B757264697368',X'6B75'),
	(87,X'4B75616E79616D61',X'4B75616E79616D61',X'6B6A'),
	(88,X'6C6174696E65',X'4C6174696E',X'6C61'),
	(89,X'4CC3AB747A65627565726765736368',X'4C7578656D626F757267697368',X'6C62'),
	(90,X'4C7567616E6461',X'47616E6461',X'6C67'),
	(91,X'4C696D6275726773',X'4C696D62757267616E',X'6C69'),
	(92,X'4C696E67C3A16C61',X'4C696E67616C61',X'6C6E'),
	(93,X'E0BA9EE0BAB2E0BAAAE0BAB2E0BAA5E0BAB2E0BAA7',X'4C616F',X'6C6F'),
	(94,X'6C696574757669C5B3206B616C6261',X'4C69746875616E69616E',X'6C74'),
	(95,X'4B696C756261',X'4C7562612D4B6174616E6761',X'6C75'),
	(96,X'6C6174766965C5A1752076616C6F6461',X'4C61747669616E',X'6C76'),
	(97,X'4761656C67',X'4D616E78',X'6776'),
	(98,X'D0BCD0B0D0BAD0B5D0B4D0BED0BDD181D0BAD0B820D198D0B0D0B7D0B8D0BA',X'4D616365646F6E69616E',X'6D6B'),
	(99,X'666974656E79206D616C6167617379',X'4D616C6167617379',X'6D67'),
	(100,X'426168617361204D656C617975',X'4D616C6179',X'6D73'),
	(101,X'E0B4AEE0B4B2E0B4AFE0B4BEE0B4B3E0B482',X'4D616C6179616C616D',X'6D6C'),
	(102,X'4D616C7469',X'4D616C74657365',X'6D74'),
	(103,X'74652072656F204DC4816F7269',X'4D616F7269',X'6D69'),
	(104,X'E0A4AEE0A4B0E0A4BEE0A4A0E0A580',X'4D617261746869',X'6D72'),
	(105,X'4B616A696E204DCCA7616A65C4BC',X'4D61727368616C6C657365',X'6D68'),
	(106,X'D09CD0BED0BDD0B3D0BED0BB20D185D18DD0BB',X'4D6F6E676F6C69616E',X'6D6E'),
	(107,X'446F726572696E204E616F65726F',X'4E61757275',X'6E61'),
	(108,X'44696EC3A92062697A616164',X'4E6176616A6F2C204E617661686F',X'6E76'),
	(109,X'6973694E646562656C65',X'4E6F727468204E646562656C65',X'6E64'),
	(110,X'E0A4A8E0A587E0A4AAE0A4BEE0A4B2E0A580',X'4E6570616C69',X'6E65'),
	(111,X'4F77616D626F',X'4E646F6E6761',X'6E67'),
	(112,X'4E6F72736B20426F6B6DC3A56C',X'4E6F7277656769616E20426F6B6DC3A56C',X'6E62'),
	(113,X'4E6F72736B204E796E6F72736B',X'4E6F7277656769616E204E796E6F72736B',X'6E6E'),
	(114,X'4E6F72736B',X'4E6F7277656769616E',X'6E6F'),
	(115,X'EA8688EA8CA0EA92BF204E756F737568786F70',X'5369636875616E205969',X'6969'),
	(116,X'6973694E646562656C65',X'536F757468204E646562656C65',X'6E72'),
	(117,X'6F63636974616E',X'4F63636974616E',X'6F63'),
	(118,X'E1908AE19382E19491E19388E190AFE192A7E1908EE19390',X'4F6A69627761',X'6F6A'),
	(119,X'D1A9D0B7D18BD0BAD18A20D181D0BBD0BED0B2D1A3D0BDD18CD181D0BAD18A',X'436875726368C2A0536C61766963',X'6375'),
	(120,X'416661616E204F726F6D6F6F',X'4F726F6D6F',X'6F6D'),
	(121,X'E0AC93E0ACA1E0ACBCE0ACBFE0AC86',X'4F72697961',X'6F72'),
	(122,X'D0B8D180D0BED0BD20C3A6D0B2D0B7D0B0D0B3',X'4F7373657469616E',X'6F73'),
	(123,X'E0A8AAE0A9B0E0A89CE0A8BEE0A8ACE0A980',X'50616E6A616269',X'7061'),
	(124,X'E0A4AAE0A4BEE0A4B4E0A4BF',X'50616C69',X'7069'),
	(125,X'D981D8A7D8B1D8B3DB8C',X'5065727369616E',X'6661'),
	(126,X'6AC4997A796B20706F6C736B69',X'506F6C697368',X'706C'),
	(127,X'D9BEDA9AD8AAD988',X'50617368746F',X'7073'),
	(128,X'506F7274756775C3AA73',X'506F7274756775657365',X'7074'),
	(129,X'52756E612053696D69',X'51756563687561',X'7175'),
	(130,X'52756D616E7473636820477269736368756E',X'526F6D616E7368',X'726D'),
	(131,X'496B6972756E6469',X'52756E6469',X'726E'),
	(132,X'526F6DC3A26EC483',X'526F6D616E69616E',X'726F'),
	(133,X'D180D183D181D181D0BAD0B8D0B9',X'5275737369616E',X'7275'),
	(134,X'E0A4B8E0A482E0A4B8E0A58DE0A495E0A583E0A4A4E0A4AEE0A58D',X'53616E736B726974',X'7361'),
	(135,X'7361726475',X'53617264696E69616E',X'7363'),
	(136,X'E0A4B8E0A4BFE0A4A8E0A58DE0A4A7E0A580',X'53696E646869',X'7364'),
	(137,X'446176766973C3A16D656769656C6C61',X'4E6F72746865726E2053616D69',X'7365'),
	(138,X'676167616E6120666127612053616D6F61',X'53616D6F616E',X'736D'),
	(139,X'79C3A26E67C3A22074C3AE2073C3A46E67C3B6',X'53616E676F',X'7367'),
	(140,X'D181D180D0BFD181D0BAD0B820D198D0B5D0B7D0B8D0BA',X'5365726269616E',X'7372'),
	(141,X'47C3A06964686C6967',X'4761656C6963',X'6764'),
	(142,X'63686953686F6E61',X'53686F6E61',X'736E'),
	(143,X'E0B783E0B792E0B682E0B784E0B6BD',X'53696E68616C61',X'7369'),
	(144,X'536C6F76656EC48D696E61',X'536C6F76616B',X'736B'),
	(145,X'536C6F76656E736B69204A657A696B',X'536C6F76656E65',X'736C'),
	(146,X'536F6F6D61616C696761',X'536F6D616C69',X'736F'),
	(147,X'5365736F74686F',X'536F75746865726E20536F74686F',X'7374'),
	(148,X'45737061C3B16F6C',X'5370616E697368',X'6573'),
	(149,X'426173612053756E6461',X'53756E64616E657365',X'7375'),
	(150,X'4B6973776168696C69',X'53776168696C69',X'7377'),
	(151,X'53695377617469',X'5377617469',X'7373'),
	(152,X'5376656E736B61',X'53776564697368',X'7376'),
	(153,X'E0AEA4E0AEAEE0AEBFE0AEB4E0AF8D',X'54616D696C',X'7461'),
	(154,X'E0B0A4E0B186E0B0B2E0B181E0B097E0B181',X'54656C756775',X'7465'),
	(155,X'D182D0BED2B7D0B8D0BAD3A3',X'54616A696B',X'7467'),
	(156,X'E0B984E0B897E0B8A2',X'54686169',X'7468'),
	(157,X'E189B5E18C8DE188ADE18A9B',X'54696772696E7961',X'7469'),
	(158,X'E0BD96E0BDBCE0BD91E0BC8BE0BDA1E0BDB2E0BD82',X'5469626574616E',X'626F'),
	(159,X'54C3BC726B6D656E',X'5475726B6D656E',X'746B'),
	(160,X'57696B616E6720546167616C6F67',X'546167616C6F67',X'746C'),
	(161,X'5365747377616E61',X'547377616E61',X'746E'),
	(162,X'46616B6120546F6E6761',X'546F6E67616E',X'746F'),
	(163,X'54C3BC726BC3A765',X'5475726B697368',X'7472'),
	(164,X'586974736F6E6761',X'54736F6E6761',X'7473'),
	(165,X'D182D0B0D182D0B0D18020D182D0B5D0BBD0B5',X'5461746172',X'7474'),
	(166,X'547769',X'547769',X'7477'),
	(167,X'52656F20546168697469',X'546168697469616E',X'7479'),
	(168,X'D8A6DB87D98AD8BADB87D8B1DA86DB95E2808E',X'556967687572',X'7567'),
	(169,X'D0A3D0BAD180D0B0D197D0BDD181D18CD0BAD0B0',X'556B7261696E69616E',X'756B'),
	(170,X'D8A7D8B1D8AFD988',X'55726475',X'7572'),
	(171,X'4FCABB7A62656B',X'557A62656B',X'757A'),
	(172,X'5473686976656EE1B89361',X'56656E6461',X'7665'),
	(173,X'5469E1BABF6E67205669E1BB8774',X'566965746E616D657365',X'7669'),
	(174,X'566F6C6170C3BC6B',X'566F6C6170C3BC6B',X'766F'),
	(175,X'57616C6F6E',X'57616C6C6F6F6E',X'7761'),
	(176,X'43796D72616567',X'57656C7368',X'6379'),
	(177,X'576F6C6C6F66',X'576F6C6F66',X'776F'),
	(178,X'467279736B',X'5765737465726E204672697369616E',X'6679'),
	(179,X'69736958686F7361',X'58686F7361',X'7868'),
	(180,X'D799D799D6B4D793D799D7A9',X'59696464697368',X'7969'),
	(181,X'596F72C3B962C3A1',X'596F72756261',X'796F'),
	(182,X'5361C9AF20637565C58BC685',X'5A6875616E67',X'7A61'),
	(183,X'6973695A756C75',X'5A756C75',X'7A75');

/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table locales
# ------------------------------------------------------------

DROP TABLE IF EXISTS `locales`;

CREATE TABLE `locales` (
  `locale_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `iso3166` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`locale_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `locales` WRITE;
/*!40000 ALTER TABLE `locales` DISABLE KEYS */;

INSERT INTO `locales` (`locale_id`, `name`, `iso3166`)
VALUES
	(1,X'41666768616E697374616E',X'414647'),
	(2,X'416C62616E6961',X'414C42'),
	(3,X'416C6765726961',X'445A41'),
	(4,X'416D65726963616E2053616D6F61',X'41534D'),
	(5,X'416E646F727261',X'414E44'),
	(6,X'416E676F6C61',X'41474F'),
	(7,X'416E6775696C6C61',X'414941'),
	(8,X'416E7461726374696361',X'415441'),
	(9,X'416E746967756120616E642042617262756461',X'415447'),
	(10,X'417267656E74696E61',X'415247'),
	(11,X'41726D656E6961',X'41524D'),
	(12,X'4172756261',X'414257'),
	(13,X'4175737472616C6961',X'415553'),
	(14,X'41757374726961',X'415554'),
	(15,X'417A65726261696A616E',X'415A45'),
	(16,X'426168616D6173',X'424853'),
	(17,X'4261687261696E',X'424852'),
	(18,X'42616E676C6164657368',X'424744'),
	(19,X'4261726261646F73',X'425242'),
	(20,X'42656C61727573',X'424C52'),
	(21,X'42656C6769756D',X'42454C'),
	(22,X'42656C697A65',X'424C5A'),
	(23,X'42656E696E',X'42454E'),
	(24,X'4265726D756461',X'424D55'),
	(25,X'42687574616E',X'42544E'),
	(26,X'426F6C697669612C20506C7572696E6174696F6E616C205374617465206F66',X'424F4C'),
	(27,X'426F6E616972652C205361696E742045757374617469757320616E642053616261',X'424553'),
	(28,X'426F736E696120616E64204865727A65676F76696E61',X'424948'),
	(29,X'426F747377616E61',X'425741'),
	(30,X'426F757665742049736C616E64',X'425654'),
	(31,X'4272617A696C',X'425241'),
	(32,X'4272697469736820496E6469616E204F6365616E205465727269746F7279',X'494F54'),
	(33,X'4272756E656920446172757373616C616D',X'42524E'),
	(34,X'42756C6761726961',X'424752'),
	(35,X'4275726B696E61204661736F',X'424641'),
	(36,X'427572756E6469',X'424449'),
	(37,X'43616D626F646961',X'4B484D'),
	(38,X'43616D65726F6F6E',X'434D52'),
	(39,X'43616E616461',X'43414E'),
	(40,X'43617065205665726465',X'435056'),
	(41,X'4361796D616E2049736C616E6473',X'43594D'),
	(42,X'43656E7472616C204166726963616E2052657075626C6963',X'434146'),
	(43,X'43686164',X'544344'),
	(44,X'4368696C65',X'43484C'),
	(45,X'4368696E61',X'43484E'),
	(46,X'4368726973746D61732049736C616E64',X'435852'),
	(47,X'436F636F7320284B65656C696E67292049736C616E6473',X'43434B'),
	(48,X'436F6C6F6D626961',X'434F4C'),
	(49,X'436F6D6F726F73',X'434F4D'),
	(50,X'436F6E676F',X'434F47'),
	(51,X'436F6E676F2C207468652044656D6F6372617469632052657075626C6963206F6620746865',X'434F44'),
	(52,X'436F6F6B2049736C616E6473',X'434F4B'),
	(53,X'436F7374612052696361',X'435249'),
	(54,X'43726F61746961',X'485256'),
	(55,X'43756261',X'435542'),
	(56,X'43757261C3A7616F',X'435557'),
	(57,X'437970727573',X'435950'),
	(58,X'437A6563686961',X'435A45'),
	(59,X'43C3B4746520642749766F697265',X'434956'),
	(60,X'44656E6D61726B',X'444E4B'),
	(61,X'446A69626F757469',X'444A49'),
	(62,X'446F6D696E696361',X'444D41'),
	(63,X'446F6D696E6963616E2052657075626C6963',X'444F4D'),
	(64,X'45637561646F72',X'454355'),
	(65,X'4567797074',X'454759'),
	(66,X'456C2053616C7661646F72',X'534C56'),
	(67,X'45717561746F7269616C204775696E6561',X'474E51'),
	(68,X'45726974726561',X'455249'),
	(69,X'4573746F6E6961',X'455354'),
	(70,X'457468696F706961',X'455448'),
	(71,X'46616C6B6C616E642049736C616E647320284D616C76696E617329',X'464C4B'),
	(72,X'4661726F652049736C616E6473',X'46524F'),
	(73,X'46696A69',X'464A49'),
	(74,X'46696E6C616E64',X'46494E'),
	(75,X'4672616E6365',X'465241'),
	(76,X'4672656E636820477569616E61',X'475546'),
	(77,X'4672656E636820506F6C796E65736961',X'505946'),
	(78,X'4672656E636820536F75746865726E205465727269746F72696573',X'415446'),
	(79,X'4761626F6E',X'474142'),
	(80,X'47616D626961',X'474D42'),
	(81,X'47656F72676961',X'47454F'),
	(82,X'4765726D616E79',X'444555'),
	(83,X'4768616E61',X'474841'),
	(84,X'47696272616C746172',X'474942'),
	(85,X'477265656365',X'475243'),
	(86,X'477265656E6C616E64',X'47524C'),
	(87,X'4772656E616461',X'475244'),
	(88,X'47756164656C6F757065',X'474C50'),
	(89,X'4775616D',X'47554D'),
	(90,X'47756174656D616C61',X'47544D'),
	(91,X'477565726E736579',X'474759'),
	(92,X'4775696E6561',X'47494E'),
	(93,X'4775696E65612D426973736175',X'474E42'),
	(94,X'477579616E61',X'475559'),
	(95,X'4861697469',X'485449'),
	(96,X'48656172642049736C616E6420616E64204D63446F6E616C642049736C616E6473',X'484D44'),
	(97,X'486F6C792053656520285661746963616E204369747920537461746529',X'564154'),
	(98,X'486F6E6475726173',X'484E44'),
	(99,X'486F6E67204B6F6E67',X'484B47'),
	(100,X'48756E67617279',X'48554E'),
	(101,X'4963656C616E64',X'49534C'),
	(102,X'496E646961',X'494E44'),
	(103,X'496E646F6E65736961',X'49444E'),
	(104,X'4972616E2C2049736C616D69632052657075626C6963206F66',X'49524E'),
	(105,X'49726171',X'495251'),
	(106,X'4972656C616E64',X'49524C'),
	(107,X'49736C65206F66204D616E',X'494D4E'),
	(108,X'49737261656C',X'495352'),
	(109,X'4974616C79',X'495441'),
	(110,X'4A616D61696361',X'4A414D'),
	(111,X'4A6170616E',X'4A504E'),
	(112,X'4A6572736579',X'4A4559'),
	(113,X'4A6F7264616E',X'4A4F52'),
	(114,X'4B617A616B687374616E',X'4B415A'),
	(115,X'4B656E7961',X'4B454E'),
	(116,X'4B69726962617469',X'4B4952'),
	(117,X'4B6F7265612C2044656D6F6372617469632050656F706C6527732052657075626C6963206F66',X'50524B'),
	(118,X'4B6F7265612C2052657075626C6963206F66',X'4B4F52'),
	(119,X'4B7577616974',X'4B5754'),
	(120,X'4B797267797A7374616E',X'4B475A'),
	(121,X'4C616F2050656F706C6527732044656D6F6372617469632052657075626C6963',X'4C414F'),
	(122,X'4C6174766961',X'4C5641'),
	(123,X'4C6562616E6F6E',X'4C424E'),
	(124,X'4C65736F74686F',X'4C534F'),
	(125,X'4C696265726961',X'4C4252'),
	(126,X'4C69627961',X'4C4259'),
	(127,X'4C6965636874656E737465696E',X'4C4945'),
	(128,X'4C69746875616E6961',X'4C5455'),
	(129,X'4C7578656D626F757267',X'4C5558'),
	(130,X'4D61636175',X'4D4143'),
	(131,X'4D616365646F6E69612C2074686520666F726D6572205975676F736C61762052657075626C6963206F66',X'4D4B44'),
	(132,X'4D616461676173636172',X'4D4447'),
	(133,X'4D616C617769',X'4D5749'),
	(134,X'4D616C6179736961',X'4D5953'),
	(135,X'4D616C6469766573',X'4D4456'),
	(136,X'4D616C69',X'4D4C49'),
	(137,X'4D616C7461',X'4D4C54'),
	(138,X'4D61727368616C6C2049736C616E6473',X'4D484C'),
	(139,X'4D617274696E69717565',X'4D5451'),
	(140,X'4D6175726974616E6961',X'4D5254'),
	(141,X'4D6175726974697573',X'4D5553'),
	(142,X'4D61796F747465',X'4D5954'),
	(143,X'4D657869636F',X'4D4558'),
	(144,X'4D6963726F6E657369612C2046656465726174656420537461746573206F66',X'46534D'),
	(145,X'4D6F6C646F76612C2052657075626C6963206F66',X'4D4441'),
	(146,X'4D6F6E61636F',X'4D434F'),
	(147,X'4D6F6E676F6C6961',X'4D4E47'),
	(148,X'4D6F6E74656E6567726F',X'4D4E45'),
	(149,X'4D6F6E74736572726174',X'4D5352'),
	(150,X'4D6F726F63636F',X'4D4152'),
	(151,X'4D6F7A616D6269717565',X'4D4F5A'),
	(152,X'4D79616E6D6172',X'4D4D52'),
	(153,X'4E616D69626961',X'4E414D'),
	(154,X'4E61757275',X'4E5255'),
	(155,X'4E6570616C',X'4E504C'),
	(156,X'4E65746865726C616E6473',X'4E4C44'),
	(157,X'4E65772043616C65646F6E6961',X'4E434C'),
	(158,X'4E6577205A65616C616E64',X'4E5A4C'),
	(159,X'4E6963617261677561',X'4E4943'),
	(160,X'4E69676572',X'4E4552'),
	(161,X'4E696765726961',X'4E4741'),
	(162,X'4E697565',X'4E4955'),
	(163,X'4E6F72666F6C6B2049736C616E64',X'4E464B'),
	(164,X'4E6F72746865726E204D617269616E612049736C616E6473',X'4D4E50'),
	(165,X'4E6F72776179',X'4E4F52'),
	(166,X'4F6D616E',X'4F4D4E'),
	(167,X'50616B697374616E',X'50414B'),
	(168,X'50616C6175',X'504C57'),
	(169,X'50616C657374696E69616E205465727269746F72792C204F63637570696564',X'505345'),
	(170,X'50616E616D61',X'50414E'),
	(171,X'5061707561204E6577204775696E6561',X'504E47'),
	(172,X'5061726167756179',X'505259'),
	(173,X'50657275',X'504552'),
	(174,X'5068696C697070696E6573',X'50484C'),
	(175,X'506974636169726E',X'50434E'),
	(176,X'506F6C616E64',X'504F4C'),
	(177,X'506F72747567616C',X'505254'),
	(178,X'50756572746F205269636F',X'505249'),
	(179,X'5161746172',X'514154'),
	(180,X'526F6D616E6961',X'524F55'),
	(181,X'5275737369616E2046656465726174696F6E',X'525553'),
	(182,X'5277616E6461',X'525741'),
	(183,X'52C3A9756E696F6E',X'524555'),
	(184,X'5361696E74204261727468C3A96C656D79',X'424C4D'),
	(185,X'5361696E742048656C656E612C20417363656E73696F6E20616E64205472697374616E2064612043756E6861',X'53484E'),
	(186,X'5361696E74204B6974747320616E64204E65766973',X'4B4E41'),
	(187,X'5361696E74204C75636961',X'4C4341'),
	(188,X'5361696E74204D617274696E20284672656E6368207061727429',X'4D4146'),
	(189,X'5361696E742050696572726520616E64204D697175656C6F6E',X'53504D'),
	(190,X'5361696E742056696E63656E7420616E6420746865204772656E6164696E6573',X'564354'),
	(191,X'53616D6F61',X'57534D'),
	(192,X'53616E204D6172696E6F',X'534D52'),
	(193,X'53616F20546F6D6520616E64205072696E63697065',X'535450'),
	(194,X'536175646920417261626961',X'534155'),
	(195,X'53656E6567616C',X'53454E'),
	(196,X'536572626961',X'535242'),
	(197,X'5365796368656C6C6573',X'535943'),
	(198,X'536965727261204C656F6E65',X'534C45'),
	(199,X'53696E6761706F7265',X'534750'),
	(200,X'53696E74204D61617274656E20284475746368207061727429',X'53584D'),
	(201,X'536C6F76616B6961',X'53564B'),
	(202,X'536C6F76656E6961',X'53564E'),
	(203,X'536F6C6F6D6F6E2049736C616E6473',X'534C42'),
	(204,X'536F6D616C6961',X'534F4D'),
	(205,X'536F75746820416672696361',X'5A4146'),
	(206,X'536F7574682047656F7267696120616E642074686520536F7574682053616E64776963682049736C616E6473',X'534753'),
	(207,X'536F75746820537564616E',X'535344'),
	(208,X'537061696E',X'455350'),
	(209,X'537269204C616E6B61',X'4C4B41'),
	(210,X'537564616E',X'53444E'),
	(211,X'537572696E616D65',X'535552'),
	(212,X'5376616C6261726420616E64204A616E204D6179656E',X'534A4D'),
	(213,X'5377617A696C616E64',X'53575A'),
	(214,X'53776564656E',X'535745'),
	(215,X'537769747A65726C616E64',X'434845'),
	(216,X'53797269616E20417261622052657075626C6963',X'535952'),
	(217,X'54616977616E2C2050726F76696E6365206F66204368696E61',X'54574E'),
	(218,X'54616A696B697374616E',X'544A4B'),
	(219,X'54616E7A616E69612C20556E697465642052657075626C6963206F66',X'545A41'),
	(220,X'546861696C616E64',X'544841'),
	(221,X'54696D6F722D4C65737465',X'544C53'),
	(222,X'546F676F',X'54474F'),
	(223,X'546F6B656C6175',X'544B4C'),
	(224,X'546F6E6761',X'544F4E'),
	(225,X'5472696E6964616420616E6420546F6261676F',X'54544F'),
	(226,X'54756E69736961',X'54554E'),
	(227,X'5475726B6579',X'545552'),
	(228,X'5475726B6D656E697374616E',X'544B4D'),
	(229,X'5475726B7320616E6420436169636F732049736C616E6473',X'544341'),
	(230,X'547576616C75',X'545556'),
	(231,X'5567616E6461',X'554741'),
	(232,X'556B7261696E65',X'554B52'),
	(233,X'556E69746564204172616220456D697261746573',X'415245'),
	(234,X'556E69746564204B696E67646F6D',X'474252'),
	(235,X'556E6974656420537461746573',X'555341'),
	(236,X'556E6974656420537461746573204D696E6F72204F75746C79696E672049736C616E6473',X'554D49'),
	(237,X'55727567756179',X'555259'),
	(238,X'557A62656B697374616E',X'555A42'),
	(239,X'56616E75617475',X'565554'),
	(240,X'56656E657A75656C612C20426F6C6976617269616E2052657075626C6963206F66',X'56454E'),
	(241,X'56696574204E616D',X'564E4D'),
	(242,X'56697267696E2049736C616E64732C2042726974697368',X'564742'),
	(243,X'56697267696E2049736C616E64732C20552E532E',X'564952'),
	(244,X'57616C6C697320616E6420467574756E61',X'574C46'),
	(245,X'5765737465726E20536168617261',X'455348'),
	(246,X'59656D656E',X'59454D'),
	(247,X'5A616D626961',X'5A4D42'),
	(248,X'5A696D6261627765',X'5A5745'),
	(249,X'C3856C616E642049736C616E6473',X'414C41');

/*!40000 ALTER TABLE `locales` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table stats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `stats`;

CREATE TABLE `stats` (
  `stats_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `caption_id` mediumint(8) unsigned NOT NULL,
  `name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unit` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `seq` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`stats_id`),
  KEY `caption_id` (`caption_id`),
  KEY `caption_id_2` (`caption_id`,`seq`),
  CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`caption_id`) REFERENCES `captions` (`caption_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table stats_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `stats_items`;

CREATE TABLE `stats_items` (
  `stats_id` int(10) unsigned NOT NULL,
  `as_of` datetime NOT NULL,
  `value` decimal(24,7) unsigned NOT NULL,
  KEY `stats_id` (`stats_id`),
  CONSTRAINT `stats_items_ibfk_1` FOREIGN KEY (`stats_id`) REFERENCES `stats` (`stats_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
