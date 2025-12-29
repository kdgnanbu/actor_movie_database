-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: cinema
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE Database cinema;
--
-- Table structure for table `actor`
--

DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actor` (
  `actor_no` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender_no` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nationality_no` int DEFAULT NULL,
  PRIMARY KEY (`actor_no`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
INSERT INTO `actor` VALUES (1,'阿部 寛',1,'1964-06-22',1),(2,'上戸 彩',2,'1985-09-14',1),(3,'仲間 由紀恵',2,'1979-10-30',1),(4,'生瀬 勝久',1,'1960-10-13',1),(5,'山下 真司',1,'1951-12-16',1),(6,'芳本 美代子',2,'1969-03-18',1),(7,'市村 正親',1,'1949-01-28',1),(8,'北村 一輝',1,'1969-07-17',1),(9,'宍戸 開',1,'1966-09-04',1),(10,'向井 理',1,'1982-02-07',1),(11,'上白石 萌歌',2,'2000-02-28',1),(12,'神尾 楓珠',1,'1999-01-21',1),(13,'詩羽',2,'2001-08-09',1),(14,'宮世琉弥',1,'2004-01-22',1),(15,'脇知弘',1,'1980-10-11',1),(16,'金子賢',1,'1976-10-19',1),(17,'阿南健治',1,'1962-02-24',1),(18,'ライアン・レイノルズ',1,'1976-10-23',2);
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `age_limit`
--

DROP TABLE IF EXISTS `age_limit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `age_limit` (
  `age_limit_no` int NOT NULL,
  `age_limit` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`age_limit_no`),
  UNIQUE KEY `age_limit_no` (`age_limit_no`),
  UNIQUE KEY `age_limit` (`age_limit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age_limit`
--

LOCK TABLES `age_limit` WRITE;
/*!40000 ALTER TABLE `age_limit` DISABLE KEYS */;
INSERT INTO `age_limit` VALUES (1,'G(なし)'),(2,'PG12'),(3,'R15+'),(4,'R18+');
/*!40000 ALTER TABLE `age_limit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `awards`
--

DROP TABLE IF EXISTS `awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `awards` (
  `count_no` int NOT NULL AUTO_INCREMENT,
  `actor_no` int NOT NULL,
  `awards` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`count_no`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `awards`
--

LOCK TABLES `awards` WRITE;
/*!40000 ALTER TABLE `awards` DISABLE KEYS */;
INSERT INTO `awards` VALUES (1,1,'第30回日劇学院賞 助演男優賞'),(2,1,'第39回 銀河賞 テレビ部門 個人賞'),(3,1,'第56回 日本放送映画藝術大賞 放送部門 最優秀助演男優賞'),(4,2,'第47回 日本アカデミー賞 優秀助演女優賞'),(5,2,'浅草演芸大賞 新人賞'),(6,2,'第7回 全日本国民的美少女コンテスト 審査員特別賞'),(7,3,'第15回ベストマザー賞 芸能部門'),(8,3,'第32回日本アカデミー賞 優秀主演女優賞'),(9,3,'第57回ザテレビジョンドラマアカデミー賞 主演女優賞'),(10,4,'高崎映画祭 最優秀助演男優賞'),(11,4,'第32回ベスト・ファーザー イエローリボン賞'),(12,6,'第16回日本歌謡大賞 優秀放送音楽新人賞'),(13,6,'第18回新宿音楽祭 審査員特別奨励賞'),(14,6,'第11回日本テレビ音楽祭 新人奨励賞'),(15,7,'第18回ゴールデン・アロー賞演劇賞'),(16,7,'第8回朝日舞台芸術賞秋元松代賞'),(17,7,'第25回読売演劇大賞優秀男優賞'),(18,8,'キネマ旬報ベスト・テン新人男優賞'),(19,8,'ニフティ映画大賞助演男優賞'),(20,8,'ヨコハマ映画祭助演男優賞'),(21,9,'アカデミー賞新人俳優賞'),(22,10,'第35回エランドール賞 新人賞'),(23,10,'第7回TVnaviドラマ・オブ・ザ・イヤー2010 最優秀助演男優賞'),(24,10,'第16回コンフィデンスアワード・ドラマ賞 助演男優賞'),(25,11,'第7回東宝「シンデレラ」オーディション グランプリ'),(26,11,'第42回日本アカデミー賞 新人俳優賞'),(27,11,'anan AWARD 2022 フォーカス部門'),(28,12,'20代俳優部門 パワースコア急上昇ランキング 第1位'),(29,12,'日本歯科医師会『ベストスマイル・オブ・ザ・イヤー2022』'),(30,12,'ヨコハマ映画祭最優秀新人賞'),(31,13,'アメイジング ミスiD2021 赤澤える賞'),(32,14,'第6回スニーカーベストドレッサー賞 俳優部門'),(33,14,'2024年上半期 ViVi国宝級イケメンランキング NEXT部門1位'),(34,14,'日経トレンディ「2026年 来年の顔」'),(35,16,'日本アカデミー賞新人俳優賞'),(36,16,'1997年最優秀新人男優賞'),(37,18,'放送映画批評家協会賞主演男優賞（コメディ部門）'),(38,18,'MTVムービー・アワードコメディ演技賞');
/*!40000 ALTER TABLE `awards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_no` int NOT NULL,
  `category` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_no`),
  UNIQUE KEY `category_no` (`category_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'洋画'),(2,'邦画');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `gender_no` int NOT NULL,
  `gender` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`gender_no`),
  UNIQUE KEY `gender_no` (`gender_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` VALUES (1,'男性'),(2,'女性'),(3,'その他');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `genre_no` int NOT NULL,
  `genre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`genre_no`),
  UNIQUE KEY `genre_no` (`genre_no`),
  UNIQUE KEY `genre` (`genre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (4,'SF'),(8,'アクション'),(9,'アドベンチャー'),(2,'コメディ'),(5,'ヒューマンドラマ'),(3,'ホラー'),(1,'ミステリー'),(6,'学園ドラマ'),(10,'恋愛'),(7,'青春ドラマ');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `movie_no` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_no` int DEFAULT NULL,
  `relese_date` date DEFAULT NULL,
  `age_limit_no` int DEFAULT NULL,
  PRIMARY KEY (`movie_no`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES (1,'トリック',2,'2002-11-09',1),(2,'テルマエ・ロマエ',2,'2012-04-28',1),(3,'パリピ孔明 THE MOVIE',2,'2025-04-25',1),(4,'ごくせん',2,'2009-07-11',1),(5,'DEADPOOL',1,'2016-06-01',3);
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_actor`
--

DROP TABLE IF EXISTS `movie_actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_actor` (
  `movie_no` int NOT NULL,
  `actor_no` int NOT NULL,
  PRIMARY KEY (`movie_no`,`actor_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_actor`
--

LOCK TABLES `movie_actor` WRITE;
/*!40000 ALTER TABLE `movie_actor` DISABLE KEYS */;
INSERT INTO `movie_actor` VALUES (1,1),(1,3),(1,4),(1,5),(1,6),(2,1),(2,2),(2,7),(2,8),(2,9),(3,10),(3,11),(3,12),(4,3),(4,4),(4,5),(4,6),(5,18);
/*!40000 ALTER TABLE `movie_actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genre`
--

DROP TABLE IF EXISTS `movie_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genre` (
  `movie_no` int NOT NULL,
  `genre_no` int NOT NULL,
  PRIMARY KEY (`movie_no`,`genre_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genre`
--

LOCK TABLES `movie_genre` WRITE;
/*!40000 ALTER TABLE `movie_genre` DISABLE KEYS */;
INSERT INTO `movie_genre` VALUES (1,1),(1,2),(1,3),(2,2),(2,3),(3,2),(3,5),(4,2),(4,6),(4,7),(5,8),(5,9),(5,10);
/*!40000 ALTER TABLE `movie_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nationality`
--

DROP TABLE IF EXISTS `nationality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nationality` (
  `nationality_no` int NOT NULL,
  `nationality` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nationality_no`),
  UNIQUE KEY `nationality_no` (`nationality_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nationality`
--

LOCK TABLES `nationality` WRITE;
/*!40000 ALTER TABLE `nationality` DISABLE KEYS */;
INSERT INTO `nationality` VALUES (1,'日本'),(2,'カナダ');
/*!40000 ALTER TABLE `nationality` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 15:54:05
