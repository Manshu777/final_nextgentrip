-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: jobportal
-- ------------------------------------------------------
-- Server version	9.3.0

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

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel_cache_livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3','i:1;',1749969555),('laravel_cache_livewire-rate-limiter:a17961fa74e9275d529f489537f179c05d50c2f3:timer','i:1749969555;',1749969555);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_educations`
--

DROP TABLE IF EXISTS `candidate_educations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_educations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint unsigned NOT NULL,
  `degree` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `college_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `passing_marks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pursuing` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_educations_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `candidate_educations_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_educations`
--

LOCK TABLES `candidate_educations` WRITE;
/*!40000 ALTER TABLE `candidate_educations` DISABLE KEYS */;
INSERT INTO `candidate_educations` VALUES (25,1,'B.Tech','Computer Science','IIT Delhi','85.5',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(26,2,'MCA','Information Technology','Mumbai University','78.0',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(27,3,'B.Sc','Data Science','Gujarat University','82.3',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(28,4,'B.Tech','Electronics','Jadavpur University','79.5',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(29,5,'BCA','Computer Applications','Punjab University','80.0',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(30,6,'M.Tech','Software Engineering','IIT Kanpur','88.2',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(31,7,'B.E','Information Technology','Anna University','76.5',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(32,8,'B.Tech','Computer Science','Osmania University','84.0',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(33,9,'B.Sc','Computer Science','Bangalore University','81.7',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(34,10,'MCA','Data Analytics','Mumbai University','83.5',0,'2025-06-14 06:03:46','2025-06-14 06:03:46'),(35,11,'B.Com','Accounting','Delhi University','82.0',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(36,12,'M.Com','Financial Management','Madras University','78.5',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(37,13,'B.Tech','Information Technology','Mumbai University','80.5',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(38,14,'MBA','Finance','Calcutta University','85.0',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(39,15,'B.Com','Accounting and Finance','Bangalore University','79.0',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(40,16,'B.Tech','Computer Science','Osmania University','83.5',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(41,17,'B.Com','Taxation','Punjab University','81.0',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(42,18,'MBA','Accounting','Lucknow University','84.5',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(43,19,'B.Sc','Information Systems','Bangalore University','80.0',0,'2025-06-14 06:14:39','2025-06-14 06:14:39'),(44,20,'M.Com','Financial Accounting','Mumbai University','82.5',0,'2025-06-14 06:14:39','2025-06-14 06:14:39');
/*!40000 ALTER TABLE `candidate_educations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_experiences`
--

DROP TABLE IF EXISTS `candidate_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_experiences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint unsigned NOT NULL,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_roles` json DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_years` int NOT NULL,
  `experience_months` int DEFAULT NULL,
  `current_salary` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_experiences_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `candidate_experiences_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_experiences`
--

LOCK TABLES `candidate_experiences` WRITE;
/*!40000 ALTER TABLE `candidate_experiences` DISABLE KEYS */;
INSERT INTO `candidate_experiences` VALUES (25,1,'Full Stack Developer','[\"Frontend Development\", \"Backend Development\"]','Future IT Touch',2,0,600000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(26,2,'Backend Developer','[\"API Development\", \"Database Management\"]','Future IT Touch',2,0,650000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(27,3,'Data Analyst','[\"Data Visualization\", \"Statistical Analysis\"]','Future IT Touch',2,0,580000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(28,4,'Embedded Systems Engineer','[\"Firmware Development\", \"Hardware Integration\"]','Future IT Touch',2,0,620000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(29,5,'Web Developer','[\"UI Design\", \"Frontend Development\"]','Future IT Touch',2,0,590000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(30,6,'Software Engineer','[\"System Design\", \"Code Optimization\"]','Future IT Touch',2,0,670000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(31,7,'DevOps Engineer','[\"CI/CD Pipeline\", \"Cloud Deployment\"]','Future IT Touch',2,0,640000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(32,8,'AI Developer','[\"Machine Learning\", \"Model Training\"]','Future IT Touch',2,0,680000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(33,9,'Frontend Developer','[\"UI/UX Design\", \"Responsive Design\"]','Future IT Touch',2,0,610000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(34,10,'Data Scientist','[\"Data Modeling\", \"Predictive Analytics\"]','Future IT Touch',2,0,660000.00,'2023-06-01','2025-06-14 06:03:46','2025-06-14 06:03:46'),(35,11,'Accountant','[\"Financial Reporting\", \"Ledger Management\"]','Future IT Touch',3,6,620000.00,'2021-12-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(36,12,'Financial Analyst','[\"Budget Analysis\", \"Financial Forecasting\"]','Future IT Touch',4,0,680000.00,'2021-06-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(37,13,'IT Consultant','[\"ERP Implementation\", \"System Integration\"]','Future IT Touch',3,9,650000.00,'2021-09-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(38,14,'Senior Accountant','[\"Tax Preparation\", \"Audit Support\"]','Future IT Touch',4,0,700000.00,'2021-06-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(39,15,'Accounts Executive','[\"Bookkeeping\", \"Payroll Management\"]','Future IT Touch',3,3,610000.00,'2022-03-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(40,16,'Software Developer','[\"Accounting Software Development\", \"API Integration\"]','Future IT Touch',3,6,670000.00,'2021-12-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(41,17,'Tax Consultant','[\"Tax Planning\", \"Compliance\"]','Future IT Touch',4,0,640000.00,'2021-06-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(42,18,'Finance Manager','[\"Financial Strategy\", \"Reporting\"]','Future IT Touch',3,9,720000.00,'2021-09-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(43,19,'ERP Developer','[\"SAP Development\", \"Database Management\"]','Future IT Touch',3,6,660000.00,'2021-12-01','2025-06-14 06:14:39','2025-06-14 06:14:39'),(44,20,'Cost Accountant','[\"Cost Analysis\", \"Budget Planning\"]','Future IT Touch',4,0,690000.00,'2021-06-01','2025-06-14 06:14:39','2025-06-14 06:14:39');
/*!40000 ALTER TABLE `candidate_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_languages`
--

DROP TABLE IF EXISTS `candidate_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_languages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint unsigned NOT NULL,
  `language_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_languages_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `candidate_languages_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_languages`
--

LOCK TABLES `candidate_languages` WRITE;
/*!40000 ALTER TABLE `candidate_languages` DISABLE KEYS */;
INSERT INTO `candidate_languages` VALUES (25,1,'English','2025-06-14 06:03:47','2025-06-14 06:03:47'),(26,2,'Hindi','2025-06-14 06:03:47','2025-06-14 06:03:47'),(27,3,'Gujarati','2025-06-14 06:03:47','2025-06-14 06:03:47'),(28,4,'Bengali','2025-06-14 06:03:47','2025-06-14 06:03:47'),(29,5,'Punjabi','2025-06-14 06:03:47','2025-06-14 06:03:47'),(30,6,'Hindi','2025-06-14 06:03:47','2025-06-14 06:03:47'),(31,7,'Tamil','2025-06-14 06:03:47','2025-06-14 06:03:47'),(32,8,'Telugu','2025-06-14 06:03:47','2025-06-14 06:03:47'),(33,9,'Kannada','2025-06-14 06:03:47','2025-06-14 06:03:47'),(34,10,'Marathi','2025-06-14 06:03:47','2025-06-14 06:03:47'),(35,11,'Hindi','2025-06-14 06:14:41','2025-06-14 06:14:41'),(36,12,'Tamil','2025-06-14 06:14:41','2025-06-14 06:14:41'),(37,13,'Marathi','2025-06-14 06:14:41','2025-06-14 06:14:41'),(38,14,'Bengali','2025-06-14 06:14:41','2025-06-14 06:14:41'),(39,15,'Kannada','2025-06-14 06:14:41','2025-06-14 06:14:41'),(40,16,'Telugu','2025-06-14 06:14:41','2025-06-14 06:14:41'),(41,17,'Punjabi','2025-06-14 06:14:41','2025-06-14 06:14:41'),(42,18,'Hindi','2025-06-14 06:14:41','2025-06-14 06:14:41'),(43,19,'Kannada','2025-06-14 06:14:41','2025-06-14 06:14:41'),(44,20,'Marathi','2025-06-14 06:14:41','2025-06-14 06:14:41');
/*!40000 ALTER TABLE `candidate_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_skills`
--

DROP TABLE IF EXISTS `candidate_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_skills` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint unsigned NOT NULL,
  `skill_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_skills_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `candidate_skills_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_skills`
--

LOCK TABLES `candidate_skills` WRITE;
/*!40000 ALTER TABLE `candidate_skills` DISABLE KEYS */;
INSERT INTO `candidate_skills` VALUES (61,1,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(62,1,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(63,1,'JavaScript','2025-06-14 06:03:46','2025-06-14 06:03:46'),(64,2,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(65,2,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(66,2,'Node.js','2025-06-14 06:03:46','2025-06-14 06:03:46'),(67,3,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(68,3,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(69,3,'Python','2025-06-14 06:03:46','2025-06-14 06:03:46'),(70,4,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(71,4,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(72,4,'C++','2025-06-14 06:03:46','2025-06-14 06:03:46'),(73,5,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(74,5,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(75,5,'React','2025-06-14 06:03:46','2025-06-14 06:03:46'),(76,6,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(77,6,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(78,6,'Java','2025-06-14 06:03:46','2025-06-14 06:03:46'),(79,7,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(80,7,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(81,7,'AWS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(82,8,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(83,8,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(84,8,'TensorFlow','2025-06-14 06:03:46','2025-06-14 06:03:46'),(85,9,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(86,9,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(87,9,'Vue.js','2025-06-14 06:03:46','2025-06-14 06:03:46'),(88,10,'HTML','2025-06-14 06:03:46','2025-06-14 06:03:46'),(89,10,'CSS','2025-06-14 06:03:46','2025-06-14 06:03:46'),(90,10,'R','2025-06-14 06:03:46','2025-06-14 06:03:46'),(91,11,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(92,11,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(93,11,'Tally','2025-06-14 06:14:39','2025-06-14 06:14:39'),(94,12,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(95,12,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(96,12,'SAP','2025-06-14 06:14:39','2025-06-14 06:14:39'),(97,13,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(98,13,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(99,13,'JavaScript','2025-06-14 06:14:39','2025-06-14 06:14:39'),(100,14,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(101,14,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(102,14,'QuickBooks','2025-06-14 06:14:39','2025-06-14 06:14:39'),(103,15,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(104,15,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(105,15,'Excel','2025-06-14 06:14:39','2025-06-14 06:14:39'),(106,16,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(107,16,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(108,16,'Python','2025-06-14 06:14:39','2025-06-14 06:14:39'),(109,17,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(110,17,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(111,17,'Tally','2025-06-14 06:14:39','2025-06-14 06:14:39'),(112,18,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(113,18,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(114,18,'SAP','2025-06-14 06:14:39','2025-06-14 06:14:39'),(115,19,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(116,19,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(117,19,'SQL','2025-06-14 06:14:39','2025-06-14 06:14:39'),(118,20,'HTML','2025-06-14 06:14:39','2025-06-14 06:14:39'),(119,20,'CSS','2025-06-14 06:14:39','2025-06-14 06:14:39'),(120,20,'QuickBooks','2025-06-14 06:14:39','2025-06-14 06:14:39');
/*!40000 ALTER TABLE `candidate_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `degree` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `college_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passing_marks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pursuing` tinyint NOT NULL DEFAULT '0',
  `experience_years` int DEFAULT NULL,
  `experience_months` int DEFAULT NULL,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_roles` json DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_salary` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `prefers_night_shift` tinyint NOT NULL DEFAULT '0',
  `prefers_day_shift` tinyint NOT NULL DEFAULT '1',
  `work_from_home` tinyint NOT NULL DEFAULT '0',
  `work_from_office` tinyint NOT NULL DEFAULT '1',
  `field_job` tinyint NOT NULL DEFAULT '0',
  `employment_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skills` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `active_user` tinyint NOT NULL DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `total_jobs_applied` int NOT NULL DEFAULT '0',
  `total_job_views` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `otp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `candidates_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Himanshu Mehra','1995-03-15','Male','himanshu.mehra@example.com','123 MG Road','Delhi','Delhi',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,'Full-time',NULL,'resume_himanshu.pdf',NULL,1,'2025-06-14 04:30:00',5,20,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword123'),(2,'Priya Sharma','1993-07-22','Female','priya.sharma@example.com','45 Park Street','Mumbai','Maharashtra',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,1,0,'Full-time',NULL,'resume_priya.pdf',NULL,1,'2025-06-14 04:00:00',3,15,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword456'),(3,'Amit Patel','1996-11-10','Male','amit.patel@example.com','78 Gandhi Nagar','Ahmedabad','Gujarat',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,1,0,'Contract',NULL,'resume_amit.pdf',NULL,1,'2025-06-13 10:15:00',7,25,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword789'),(4,'Sneha Gupta','1994-05-30','Female','sneha.gupta@example.com','12 Lake View','Kolkata','West Bengal',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,0,0,'Full-time',NULL,'resume_sneha.pdf',NULL,1,'2025-06-14 02:50:00',4,18,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword012'),(5,'Rahul Verma','1992-09-12','Male','rahul.verma@example.com','89 Sector 15','Chandigarh','Punjab',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,1,0,'Part-time',NULL,'resume_rahul.pdf',NULL,1,'2025-06-13 06:40:00',6,22,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword345'),(6,'Anjali Singh','1997-02-25','Female','anjali.singh@example.com','34 Civil Lines','Lucknow','Uttar Pradesh',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,1,0,0,'Full-time',NULL,'resume_anjali.pdf',NULL,1,'2025-06-14 05:45:00',2,10,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword678'),(7,'Vikram Rao','1991-12-05','Male','vikram.rao@example.com','56 Anna Nagar','Chennai','Tamil Nadu',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,1,0,'Full-time',NULL,'resume_vikram.pdf',NULL,1,'2025-06-13 09:00:00',8,30,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword901'),(8,'Neha Joshi','1995-08-18','Female','neha.joshi@example.com','23 Banjara Hills','Hyderabad','Telangana',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,1,0,'Contract',NULL,'resume_neha.pdf',NULL,1,'2025-06-14 02:20:00',5,17,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword234'),(9,'Suresh Kumar','1993-04-20','Male','suresh.kumar@example.com','67 Residency Road','Bangalore','Karnataka',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,'Full-time',NULL,'resume_suresh.pdf',NULL,1,'2025-06-14 03:30:00',3,12,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword567'),(10,'Ritu Desai','1996-06-14','Female','ritu.desai@example.com','101 Marine Drive','Mumbai','Maharashtra',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,1,1,0,'Full-time',NULL,'resume_ritu.pdf',NULL,1,'2025-06-14 05:15:00',4,19,'2025-06-14 06:03:45','2025-06-14 06:03:45',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword890'),(11,'Kunal Gupta','1992-01-12','Male','kunal.gupta@example.com','22 Vasant Vihar','Delhi','Delhi',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,'Full-time',NULL,'resume_kunal.pdf',NULL,1,'2025-06-14 05:30:00',4,18,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword111'),(12,'Meera Iyer','1994-04-25','Female','meera.iyer@example.com','67 Anna Salai','Chennai','Tamil Nadu',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,1,0,'Full-time',NULL,'resume_meera.pdf',NULL,1,'2025-06-14 05:00:00',5,20,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword222'),(13,'Rohan Desai','1993-08-17','Male','rohan.desai@example.com','89 Bandra West','Mumbai','Maharashtra',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,1,0,'Contract',NULL,'resume_rohan.pdf',NULL,1,'2025-06-13 10:30:00',6,22,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword333'),(14,'Pooja Shah','1995-06-30','Female','pooja.shah@example.com','34 Lake Road','Kolkata','West Bengal',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,0,0,'Full-time',NULL,'resume_pooja.pdf',NULL,1,'2025-06-14 03:45:00',3,15,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword444'),(15,'Arjun Nair','1991-11-05','Male','arjun.nair@example.com','56 MG Road','Bangalore','Karnataka',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,1,0,'Part-time',NULL,'resume_arjun.pdf',NULL,1,'2025-06-13 08:15:00',7,25,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword555'),(16,'Divya Reddy','1996-03-22','Female','divya.reddy@example.com','12 Jubilee Hills','Hyderabad','Telangana',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,1,0,0,'Full-time',NULL,'resume_divya.pdf',NULL,1,'2025-06-14 06:30:00',2,12,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword666'),(17,'Siddharth Malhotra','1990-12-10','Male','siddharth.malhotra@example.com','78 Sector 7','Chandigarh','Punjab',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,1,0,'Full-time',NULL,'resume_siddharth.pdf',NULL,1,'2025-06-13 10:00:00',8,28,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword777'),(18,'Nisha Kapoor','1994-09-15','Female','nisha.kapoor@example.com','45 Civil Lines','Lucknow','Uttar Pradesh',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,1,0,'Contract',NULL,'resume_nisha.pdf',NULL,1,'2025-06-14 03:15:00',4,16,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword888'),(19,'Vivek Sharma','1993-02-28','Male','vivek.sharma@example.com','101 Koramangala','Bangalore','Karnataka',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,0,0,'Full-time',NULL,'resume_vivek.pdf',NULL,1,'2025-06-14 04:45:00',5,19,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword999'),(20,'Aarti Patel','1995-07-20','Female','aarti.patel@example.com','23 Nariman Point','Mumbai','Maharashtra',NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,1,1,0,'Full-time',NULL,'resume_aarti.pdf',NULL,1,'2025-06-14 06:00:00',3,14,'2025-06-14 06:14:38','2025-06-14 06:14:38',NULL,NULL,NULL,NULL,'$2y$10$examplehashedpassword000');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employer_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gst_certificate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_certificate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `company_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `companies_employer_id_foreign` (`employer_id`),
  CONSTRAINT `companies_employer_id_foreign` FOREIGN KEY (`employer_id`) REFERENCES `employers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,32,'MAN',NULL,NULL,1,'Mohali','7988532993','7988532993','2025-06-14 03:07:42','2025-06-14 03:18:10'),(2,32,'Best Company Ever','documents/gst_1749891069_Group 2.pdf',NULL,0,'Chandigarh',NULL,'7988532993','2025-06-14 03:21:09','2025-06-14 03:21:09');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employers`
--

DROP TABLE IF EXISTS `employers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_certificate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_pan_card` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_gst` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `otp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employers`
--

LOCK TABLES `employers` WRITE;
/*!40000 ALTER TABLE `employers` DISABLE KEYS */;
INSERT INTO `employers` VALUES (1,'','Techverse Pvt Ltd',NULL,NULL,NULL,'Bangalore, India',NULL,'hr@techverse.com','hr@techverse.com','9876543210','2025-05-01 09:52:01','2025-05-10 07:19:01',NULL,NULL,NULL,NULL,0,0),(2,'','MediCare Solutions',NULL,NULL,NULL,'Mumbai, India',NULL,'contact@medicare.com','hr@techverse.com','9123456789','2025-05-01 09:52:01','2025-05-01 09:52:01',NULL,NULL,NULL,NULL,0,0),(3,'','Techverse Pvt Ltd',NULL,NULL,NULL,'Bangalore, India',NULL,'hr@techverse.com','hr@techverse.com','9876543210','2025-05-01 09:53:36','2025-05-01 09:53:36',NULL,NULL,NULL,NULL,0,0),(4,'','MediCare Solutions',NULL,NULL,NULL,'Mumbai, India',NULL,'contact@medicare.com','hr@techverse.com','9123456789','2025-05-01 09:53:36','2025-05-01 09:53:36',NULL,NULL,NULL,NULL,0,0),(5,'','Techverse Pvt Ltd',NULL,NULL,NULL,'Bangalore, India',NULL,'hr@techverse.com','hr@techverse.com','9876543210','2025-05-01 09:55:12','2025-05-01 09:55:12',NULL,NULL,NULL,NULL,0,0),(6,'','MediCare Solutions',NULL,NULL,NULL,'Mumbai, India',NULL,'contact@medicare.com','hr@techverse.com','9123456789','2025-05-01 09:55:12','2025-05-01 09:55:12',NULL,NULL,NULL,NULL,0,0),(7,'','Techverse Pvt Ltd',NULL,NULL,NULL,'Bangalore, India',NULL,'hr@techverse.com','hr@techverse.com','9876543210','2025-05-01 09:55:28','2025-05-01 09:55:28',NULL,NULL,NULL,NULL,0,0),(8,'','MediCare Solutions',NULL,NULL,NULL,'Mumbai, India',NULL,'contact@medicare.com','hr@techverse.com','9123456789','2025-05-01 09:55:28','2025-05-10 07:19:03',NULL,NULL,NULL,NULL,0,0),(23,'f3','Swiggy',NULL,NULL,NULL,NULL,NULL,NULL,'manshusmartboy@gmail.com',NULL,'2025-05-21 11:30:12','2025-05-26 09:39:19','$2y$12$fCp1rQwx5Jl3MoZpt3bfhuhbLOXwb6f.0JVg3jAmgJvTDpn5QgzNK','2025-05-21 11:30:12',NULL,NULL,1,0),(24,'masnhu Mehra','SKymoreIt Solutions',NULL,NULL,NULL,'Mohali',NULL,NULL,'director@skymoreitsolutions.com','7988532993','2025-05-21 11:47:29','2025-05-21 12:05:22','$2y$12$pjf4RW0jiz/.4QgQxJiLdup9iB9.Xt/d/i4HYpZ8Szkz667n2DUmi','2025-05-21 11:47:29',NULL,NULL,1,NULL),(25,'Manshu','Sky MOre It',NULL,NULL,NULL,'Ambala',NULL,NULL,'skymore@skymore.com','7988532993','2025-05-23 10:47:08','2025-05-23 10:48:08','$2y$12$.kOOzYtqZbBWmib4Ts3pI.PF9Fkb/Oducd3ee00YRPV8o1dFJRBX.','2025-05-23 10:47:08',NULL,NULL,1,NULL),(27,'Manshu','Skymore',NULL,NULL,NULL,'Ambala Cantt',NULL,NULL,'manshu.de@gmail.com','7988532993','2025-05-26 09:50:44','2025-05-26 09:52:13','$2y$12$FmsBF652X5Bz8yMJAmcbSOGJCV7zK3m2wuIVJ1jiIx9PeYQgaKnxK','2025-05-26 09:50:44',NULL,NULL,1,NULL),(31,'Anv','Skure',NULL,NULL,NULL,'Amb',NULL,NULL,'mehrahimanshu50@gmail.com','7988532993','2025-05-26 11:40:29','2025-05-26 11:42:02','$2y$12$5pePYyoGB/PFOmJnPxjldesK5io0LaZybuFrJMaXjjwNSPeUM4k9e','2025-05-26 11:40:29',NULL,NULL,1,NULL),(32,'ftftdj','srgrsg',NULL,NULL,NULL,'mas',NULL,NULL,'manshu.developer@gmail.com','7988532993','2025-05-27 11:43:14','2025-05-28 11:22:52','$2y$12$eBPK90Uyh57b7x3M2tBwFuyI0WD6Kql/nnP2IjT6cjry.01mDgC7e','2025-05-28 11:22:52',NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `employers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_posting_applications`
--

DROP TABLE IF EXISTS `job_posting_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posting_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `job_posting_id` bigint unsigned NOT NULL,
  `status` enum('applied','interview','rejected','hired') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `candidate_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_posting_applications_user_id_foreign` (`user_id`),
  KEY `job_posting_applications_job_posting_id_foreign` (`job_posting_id`),
  KEY `job_posting_applications_candidate_id_foreign` (`candidate_id`),
  CONSTRAINT `job_posting_applications_candidate_id_foreign` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `job_posting_applications_job_posting_id_foreign` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`),
  CONSTRAINT `job_posting_applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_posting_applications`
--

LOCK TABLES `job_posting_applications` WRITE;
/*!40000 ALTER TABLE `job_posting_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_posting_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employer_id` bigint unsigned NOT NULL,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_location_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `compensation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pay_type` enum('Hourly','Salary','Per Project') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `joining_fee` tinyint(1) NOT NULL DEFAULT '0',
  `basic_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `additional_requirements` json DEFAULT NULL,
  `is_walkin_interview` tinyint(1) NOT NULL DEFAULT '0',
  `communication_preference` enum('Call','Whatsapp','No Preference') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_experience_required` int DEFAULT NULL,
  `other_job_titles` json DEFAULT NULL,
  `degree_specialization` json DEFAULT NULL,
  `job_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `job_expire_time` int NOT NULL DEFAULT '7',
  `number_of_candidates_required` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `job_postings_employer_id_foreign` (`employer_id`),
  CONSTRAINT `job_postings_employer_id_foreign` FOREIGN KEY (`employer_id`) REFERENCES `employers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES (1,2,'Backend Developer','part_time','Hyderabad, India','onsite','20 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior HR Executive\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:52:01','2025-05-23 12:23:05',1),(2,2,'Graphic Designer','part_time','Chennai, India','remote','20 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',5,'[\"Junior Backend Developer\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:52:01','2025-05-23 12:23:06',1),(3,2,'Business Analyst','part_time','Chennai, India','remote','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',0,'[\"Junior Content Writer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:52:01','2025-05-23 12:23:07',1),(4,1,'Backend Developer','full_time','Mumbai, India','hybrid','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior Network Engineer\", \"Assistant Software Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,1,'2025-05-01 09:52:01','2025-05-23 12:23:08',1),(5,1,'Frontend Developer','freelance','Chennai, India','onsite','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Backend Developer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:52:01','2025-05-23 12:23:08',1),(6,2,'Customer Support Executive','part_time','Hyderabad, India','remote','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',2,'[\"Junior Software Developer\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,5,'2025-05-01 09:52:01','2025-05-23 12:23:09',1),(7,1,'Sales Manager','internship','Chennai, India','onsite','8 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior HR Executive\", \"Assistant HR Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,4,'2025-05-01 09:52:01','2025-05-23 12:23:10',1),(8,2,'Business Analyst','freelance','Hyderabad, India','onsite','10 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Backend Developer\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:52:01','2025-05-23 12:23:11',1),(9,2,'Digital Marketer','part_time','Chennai, India','hybrid','5 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Frontend Developer\", \"Assistant Frontend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(10,1,'Content Writer','full_time','Chennai, India','remote','12 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior QA Tester\", \"Assistant Software Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,5,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(11,2,'Customer Support Executive','full_time','Bangalore, India','hybrid','3 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Business Analyst\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,4,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(12,1,'Backend Developer','internship','Bangalore, India','hybrid','15 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Backend Developer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(13,1,'Sales Manager','internship','Bangalore, India','hybrid','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Graphic Designer\", \"Assistant Software Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(14,1,'HR Executive','freelance','Chennai, India','onsite','14 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Digital Marketer\", \"Assistant Sales Manager\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(15,1,'Network Engineer','full_time','Pune, India','remote','3 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Software Developer\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(16,1,'Customer Support Executive','internship','Bangalore, India','onsite','14 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Sales Manager\", \"Assistant Content Writer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:52:01','2025-05-01 09:52:01',0),(17,1,'Network Engineer','part_time','Hyderabad, India','remote','11 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Software Developer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(18,1,'Sales Manager','internship','Chennai, India','remote','7 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',2,'[\"Junior Frontend Developer\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,1,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(19,2,'Sales Manager','part_time','Pune, India','onsite','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Software Developer\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(20,2,'HR Executive','full_time','Bangalore, India','onsite','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Sales Manager\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(21,2,'Graphic Designer','freelance','Mumbai, India','remote','14 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Backend Developer\", \"Assistant Content Writer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,9,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(22,1,'Backend Developer','internship','Pune, India','onsite','6 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',4,'[\"Junior Digital Marketer\", \"Assistant Customer Support Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(23,1,'Digital Marketer','part_time','Mumbai, India','remote','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',0,'[\"Junior Sales Manager\", \"Assistant HR Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,5,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(24,1,'HR Executive','part_time','Chennai, India','hybrid','10 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',0,'[\"Junior Customer Support Executive\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(25,1,'Digital Marketer','freelance','Hyderabad, India','remote','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Frontend Developer\", \"Assistant Content Writer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,4,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(26,2,'Graphic Designer','full_time','Hyderabad, India','remote','15 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Software Developer\", \"Assistant Frontend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(27,2,'Backend Developer','freelance','Pune, India','remote','5 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Content Writer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:53:36','2025-05-01 09:53:36',0),(28,2,'Sales Manager','part_time','Hyderabad, India','onsite','17 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior HR Executive\", \"Assistant Content Writer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(29,1,'Frontend Developer','part_time','Mumbai, India','remote','6 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',4,'[\"Junior Content Writer\", \"Assistant Digital Marketer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(30,1,'Graphic Designer','full_time','Mumbai, India','onsite','10 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',2,'[\"Junior Backend Developer\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(31,2,'Graphic Designer','full_time','Hyderabad, India','remote','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Sales Manager\", \"Assistant HR Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(32,1,'Backend Developer','freelance','Bangalore, India','onsite','19 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',0,'[\"Junior Digital Marketer\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(33,2,'Graphic Designer','internship','Hyderabad, India','remote','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Backend Developer\", \"Assistant Customer Support Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(34,2,'HR Executive','full_time','Mumbai, India','onsite','12 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior Sales Manager\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(35,1,'Customer Support Executive','internship','Mumbai, India','onsite','3 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Customer Support Executive\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,5,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(36,2,'Frontend Developer','freelance','Mumbai, India','hybrid','12 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Graphic Designer\", \"Assistant Digital Marketer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(37,2,'Frontend Developer','part_time','Bangalore, India','remote','15 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',4,'[\"Junior Backend Developer\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,1,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(38,1,'QA Tester','full_time','Chennai, India','remote','12 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',3,'[\"Junior Backend Developer\", \"Assistant HR Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(39,1,'Network Engineer','freelance','Pune, India','remote','5 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',0,'[\"Junior Network Engineer\", \"Assistant Backend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,4,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(40,1,'Sales Manager','freelance','Bangalore, India','onsite','17 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Content Writer\", \"Assistant Software Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(41,2,'Backend Developer','freelance','Pune, India','hybrid','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Business Analyst\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(42,2,'QA Tester','freelance','Mumbai, India','remote','20 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior Graphic Designer\", \"Assistant Frontend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(43,2,'Content Writer','part_time','Chennai, India','onsite','4 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior Graphic Designer\", \"Assistant Sales Manager\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:55:12','2025-05-01 09:55:12',0),(44,1,'Backend Developer','part_time','Mumbai, India','remote','18 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',0,'[\"Junior Sales Manager\", \"Assistant Network Engineer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,1,'2025-05-01 09:55:12','2025-05-23 12:23:01',1),(45,1,'QA Tester','freelance','Pune, India','onsite','13 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',1,'[\"Junior Content Writer\", \"Assistant QA Tester\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,8,'2025-05-01 09:55:28','2025-05-23 12:23:00',1),(46,1,'Digital Marketer','freelance','Mumbai, India','remote','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',3,'[\"Junior Digital Marketer\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,10,'2025-05-01 09:55:28','2025-05-23 12:22:58',1),(47,1,'Network Engineer','freelance','Pune, India','remote','9 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',1,'[\"Junior Backend Developer\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:55:28','2025-05-23 12:22:57',1),(48,1,'Network Engineer','full_time','Hyderabad, India','onsite','5 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',4,'[\"Junior Sales Manager\", \"Assistant Customer Support Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,6,'2025-05-01 09:55:28','2025-05-23 12:22:55',1),(49,2,'Backend Developer','internship','Pune, India','remote','10 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',2,'[\"Junior Business Analyst\", \"Assistant Frontend Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:28','2025-05-23 12:22:55',1),(50,2,'HR Executive','internship','Chennai, India','hybrid','7 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',3,'[\"Junior Software Developer\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,1,'2025-05-01 09:55:28','2025-05-23 12:22:53',1),(51,1,'Customer Support Executive','internship','Pune, India','remote','3 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',4,'[\"Junior Content Writer\", \"Assistant Graphic Designer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:55:28','2025-05-23 12:22:51',1),(52,2,'Software Developer','full_time','Chennai, India','hybrid','16 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior Software Developer\", \"Assistant Digital Marketer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:28','2025-05-23 12:22:50',1),(53,2,'Digital Marketer','part_time','Mumbai, India','onsite','8 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',4,'[\"Junior Business Analyst\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,3,'2025-05-01 09:55:28','2025-05-23 12:22:49',1),(54,2,'Sales Manager','freelance','Hyderabad, India','hybrid','11 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',3,'[\"Junior Sales Manager\", \"Assistant Business Analyst\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,7,'2025-05-01 09:55:28','2025-05-23 12:22:49',1),(55,2,'Content Writer','internship','Mumbai, India','hybrid','9 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',0,'Call',5,'[\"Junior Business Analyst\", \"Assistant Content Writer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:28','2025-05-23 12:22:48',1),(56,1,'Customer Support Executive','freelance','Pune, India','hybrid','15 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',2,'[\"Junior QA Tester\", \"Assistant HR Executive\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:28','2025-05-23 12:22:47',1),(57,2,'Business Analyst','full_time','Bangalore, India','remote','10 LPA','Hourly',0,'Basic knowledge of the domain, strong communication skills.','[\"Team player\", \"Problem-solving skills\"]',1,'Call',3,'[\"Junior Network Engineer\", \"Assistant Software Developer\"]','[\"B.Tech\", \"MBA\", \"B.Sc IT\"]','We are looking for a passionate individual to join our team.',7,2,'2025-05-01 09:55:28','2025-05-23 12:22:46',1),(58,1,'Software Engineer','Full-Time','New York','Hybrid','100000','Salary',0,'5+ years of experience, proficient in PHP','\"{\\\"skills\\\": [\\\"Laravel\\\", \\\"MySQL\\\"]}\"',0,'No Preference',5,'\"[\\\"Backend Developer\\\", \\\"Full Stack Developer\\\"]\"','\"[\\\"Computer Science\\\", \\\"Information Technology\\\"]\"','Develop and maintain web applications.',14,2,'2025-05-13 10:41:13','2025-05-23 12:22:45',1),(63,23,'tt3t3t','Full-Time','ef3fg','Work from Home','20000-19998','Salary',0,'gtrgt','\"[\\\"rtg\\\"]\"',0,'No Preference',0,'\"[\\\"Software Engineer\\\",\\\"Designer\\\"]\"','\"[\\\"High School\\\"]\"','rgrg',22,22,'2025-05-21 11:31:58','2025-05-23 12:22:44',1),(64,24,'fwf','Full-Time','Mohali','Work from Home','100000-1998','Hourly',0,'frw','\"[\\\"frrf\\\"]\"',0,'No Preference',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','ewfr',10,100,'2025-05-21 12:06:36','2025-05-21 12:19:53',1),(65,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:27:05','2025-05-23 12:22:43',1),(66,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:27:19','2025-05-23 12:22:42',1),(67,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:27:55','2025-05-23 12:22:40',1),(68,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:28:27','2025-05-23 12:22:40',1),(69,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:30:49','2025-05-23 12:22:39',1),(70,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:32:15','2025-05-23 12:22:38',1),(71,24,'qawestdryftuyg','Full-Time','estrdtyfu','Work from Home','123456-123456','Hourly',0,'huouo','\"[\\\"gy\\\"]\"',0,'Call',0,'\"[\\\"Software Engineer\\\"]\"','\"[\\\"High School\\\"]\"','h',55,7,'2025-05-21 12:32:56','2025-05-23 12:22:37',1),(72,25,'cdwfrw','Full-Time','Ambala','Work from Home','2100-5000','Salary',0,'fr3f3f','\"[\\\"fr42\\\"]\"',0,'No Preference',3,'\"[\\\"Designer\\\"]\"','\"[\\\"High School\\\"]\"','efr4r4',20,10,'2025-05-23 10:49:57','2025-05-23 12:22:36',1),(73,31,'Full Stack developer','Freelance','ambala Cantt','Work from Home','20000-30000','Salary',0,'null','\"[\\\"CSS\\\",\\\"JavaScript\\\",\\\"Laravel\\\",\\\"Node.js\\\"]\"',0,'Call',10,'\"[\\\"Product Manager\\\"]\"','\"[\\\"Bachelor\'s Degree\\\"]\"','aesrdytfuygiuhoij',10,10,'2025-05-29 12:05:04','2025-05-29 12:05:04',0);
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_04_23_151109_create_candidates_table',1),(5,'2025_04_23_151408_create_candidate_educations_table',1),(6,'2025_04_23_151430_create_candidate_experiences_table',1),(7,'2025_04_23_151453_create_candidate_skills_table',1),(8,'2025_04_23_151541_create_candidate_languages_table',1),(9,'2025_04_23_154810_create_employers_table',1),(10,'2025_04_23_154855_create_job_postings_table',1),(11,'2025_04_23_155959_create_job_posting_applications_table',1),(12,'2025_04_26_071329_alter_job_type_column_in_job_postings_table',1),(13,'2025_04_26_071434_alter_work_location_type_column_in_job_postings_table',1),(14,'2025_04_26_073057_modify_status_column_in_job_posting_applications_table',1),(15,'2025_04_27_054200_add_otp_fields_to_candidates_table',1),(16,'2025_04_27_105808_create_personal_access_tokens_table',1),(17,'2025_04_27_110508_make_full_name_nullable_in_candidates_table',2),(18,'2025_05_01_152249_add_candidate_id_to_job_posting_applications_table',3),(19,'2025_05_10_123509_add_fields_to_employers_table',4),(20,'2025_05_10_123600_create_companies_table',5),(21,'2025_05_10_123954_add_auth_fields_to_employers_table',6),(22,'2025_05_10_124815_add_is_blocked_to_employers_table',7),(23,'add_session_token_to_employers_table',8),(24,'2025_05_11_065811_create_otp_verifications_table',9),(25,'2025_05_26_163832_add_gst_and_pan_to_employers_table',10),(26,'2025_06_14_052230_create_companies_table',11);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
INSERT INTO `otp_verifications` VALUES (2,'manshu.develoepr@gmail.com','648666','2025-05-26 09:54:53','2025-05-11 02:04:03','2025-05-26 09:44:53'),(6,'manshu.developer@gmail.com','125646','2025-06-15 01:13:45','2025-05-12 08:48:44','2025-06-15 01:03:45'),(7,'masnhu.developer@gmail.com','902966','2025-05-12 09:02:37','2025-05-12 08:52:37','2025-05-12 08:52:37'),(8,'manshusmartboy@gmail.com','665339','2025-05-26 10:16:55','2025-05-14 10:41:56','2025-05-26 10:06:55'),(9,'mehrahimanshu50@gmail.com','400108','2025-05-29 11:26:20','2025-05-14 10:43:07','2025-05-29 11:16:20'),(10,'manshu.smartboy@gmail.com','768558','2025-05-21 11:38:59','2025-05-21 11:28:59','2025-05-21 11:28:59'),(11,'manshiu.developer@gmail.com','664800','2025-06-15 01:11:30','2025-06-15 01:01:30','2025-06-15 01:01:30');
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Employer',17,'EmployerToken','f74bad65e79ae1f4fdbd19010c16b23bb792d120bc4a4aa7fca219fdaa71a2b6','[\"*\"]','2025-05-12 09:26:12',NULL,'2025-05-12 09:02:13','2025-05-12 09:26:12'),(2,'App\\Models\\Employer',18,'EmployerToken','9e360889ea7d0bff7e2264fd705197b7bfb383d56f08ecb255adf337528e5b1b','[\"*\"]','2025-05-13 10:31:54',NULL,'2025-05-13 08:46:59','2025-05-13 10:31:54'),(3,'App\\Models\\Employer',19,'EmployerToken','f8f6d61be50afa4fbc707141d6cdde015b1f3ce2c805a01f6d329acebd35bc97','[\"*\"]','2025-05-14 10:31:15',NULL,'2025-05-14 09:37:03','2025-05-14 10:31:15'),(4,'App\\Models\\Employer',20,'EmployerToken','044fca0dc565cda65b7d8b50fbd836349a1c630d9044f29e319f7aa350fa9f58','[\"*\"]','2025-05-16 10:04:57',NULL,'2025-05-15 08:11:57','2025-05-16 10:04:57'),(5,'App\\Models\\Employer',21,'EmployerToken','8cf1add6f02e7d5a22437fd9e8235d9ec2a793eb0ef09bcc5c7569e010deb355','[\"*\"]','2025-05-18 01:09:33',NULL,'2025-05-17 23:47:17','2025-05-18 01:09:33'),(6,'App\\Models\\Employer',22,'EmployerToken','f33c4b68bc589f61d75c049b7c869dbc2973baae2ff909240d72fe35bd5fd980','[\"*\"]','2025-05-21 11:17:12',NULL,'2025-05-21 11:10:24','2025-05-21 11:17:12'),(7,'App\\Models\\Employer',23,'EmployerToken','33b48b2bef0a0d35ceda5e14d1a1e34b635c63d5bcc7e3bd1aa6e2692db9a99c','[\"*\"]','2025-05-21 11:34:35',NULL,'2025-05-21 11:30:17','2025-05-21 11:34:35'),(8,'App\\Models\\Employer',24,'EmployerToken','99aa33a0a977d9d202fbde457432330a383eda651fa739aab28876a4e499b542','[\"*\"]','2025-05-23 10:37:29',NULL,'2025-05-21 11:47:37','2025-05-23 10:37:29'),(9,'App\\Models\\Employer',25,'EmployerToken','6cd334ffad222b8cf579d8b209908c39945cfd4fc894e2facf222b87f26f94f5','[\"*\"]','2025-05-23 10:50:17',NULL,'2025-05-23 10:47:13','2025-05-23 10:50:17'),(10,'App\\Models\\Employer',26,'EmployerToken','c1dadafa5fcf0d7057fcf7e7203f4123895bf4927702a3a0ee2d0752097e1c58','[\"*\"]','2025-05-23 12:26:04',NULL,'2025-05-23 12:25:40','2025-05-23 12:26:04'),(11,'App\\Models\\Employer',27,'EmployerToken','b2e7dfed1b9479c453033ece92f86549ef53cd7501ccabc82583fa620c884750','[\"*\"]','2025-05-26 09:52:16',NULL,'2025-05-26 09:50:48','2025-05-26 09:52:16'),(12,'App\\Models\\Employer',28,'EmployerToken','ce7575a65fa1ddd7207a5cc6da2297d143eaea2e4ceddda1a060304662dcbb11','[\"*\"]','2025-05-26 10:04:01',NULL,'2025-05-26 10:02:46','2025-05-26 10:04:01'),(13,'App\\Models\\Employer',28,'EmployerToken','e29e67bd1fd61da7fe537e1394f33b2a5c220726a15aa1f32c3e7674423c8d34','[\"*\"]','2025-05-26 10:06:08',NULL,'2025-05-26 10:05:50','2025-05-26 10:06:08'),(14,'App\\Models\\Employer',28,'EmployerToken','8c947b79e7a1657a0d890dd8f6628a1288c5eb4c3d5986e503a71ddcd433b2d3','[\"*\"]','2025-05-26 10:06:38',NULL,'2025-05-26 10:06:35','2025-05-26 10:06:38'),(15,'App\\Models\\Employer',23,'EmployerToken','af213453a7b22650d2338ae113f856c22285267ba0973afb7ebaf0eedfd27fe7','[\"*\"]','2025-05-26 10:08:14',NULL,'2025-05-26 10:07:12','2025-05-26 10:08:14'),(16,'App\\Models\\Employer',29,'EmployerToken','edb1a4a40fb30b3dfa387d0394c87653fd5433cccd61a79486acd154e561382a','[\"*\"]','2025-05-26 11:21:13',NULL,'2025-05-26 11:20:20','2025-05-26 11:21:13'),(17,'App\\Models\\Employer',30,'EmployerToken','9eb526be5c3f2208d3b829de55e3c8681e3134258795dca65da93e3a4f87e140','[\"*\"]','2025-05-26 11:36:36',NULL,'2025-05-26 11:26:53','2025-05-26 11:36:36'),(18,'App\\Models\\Employer',31,'EmployerToken','e6aada19441b580eaba9c879cc0692c843843a3d3842362f4591091170be9c1b','[\"*\"]','2025-05-27 11:40:08',NULL,'2025-05-26 11:40:33','2025-05-27 11:40:08'),(19,'App\\Models\\Employer',32,'EmployerToken','8ac4e1f642b09a1a8059eba3fb98f2628ac1737fc6eb1a1dcb5f83bf8909c6e4','[\"*\"]','2025-05-27 11:43:30',NULL,'2025-05-27 11:43:18','2025-05-27 11:43:30'),(20,'App\\Models\\Employer',31,'EmployerToken','e182b96fadcf1a4fd8cca69b034460dab127375985c5b93405e57fcff0b17602','[\"*\"]','2025-05-27 12:03:58',NULL,'2025-05-27 11:44:27','2025-05-27 12:03:58'),(21,'App\\Models\\Employer',32,'EmployerToken','bf0b7e57dbe36d240eddfa0f3f4ed3e325c94504beccffb4fb3de2634b8a2c79','[\"*\"]','2025-05-28 11:52:07',NULL,'2025-05-28 11:23:01','2025-05-28 11:52:07'),(22,'App\\Models\\Employer',32,'EmployerToken','ba428298aee4e20b4f86ba2e22e17aa90442c50b99bc180013c08254b6bbbde0','[\"*\"]','2025-05-29 10:14:57',NULL,'2025-05-29 09:57:04','2025-05-29 10:14:57'),(23,'App\\Models\\Employer',31,'EmployerToken','164f686573481e7e2ad19b0b7f58d77317c7d4cb7aaad82f8b22bcd3e7e060cc','[\"*\"]','2025-05-29 12:05:10',NULL,'2025-05-29 11:16:38','2025-05-29 12:05:10'),(24,'App\\Models\\Employer',32,'EmployerToken','fd581f4be5cb35da945f555f7769c9b2b7eeb24ac9e4344ac1207c95356c7f28','[\"*\"]','2025-06-14 00:02:26',NULL,'2025-06-13 23:47:32','2025-06-14 00:02:26'),(25,'App\\Models\\Employer',32,'EmployerToken','a4b83821bcaf69a48bfb9688fe73c173e8eae4115d725c0530ce8a8c3449899d','[\"*\"]','2025-06-14 03:21:14',NULL,'2025-06-14 00:11:39','2025-06-14 03:21:14'),(26,'App\\Models\\Employer',32,'EmployerToken','e6610e89fe3a3592c880dd4b8282c4b0ee08d9b1a55d76a0cb4b2667e9d13bca','[\"*\"]','2025-06-15 02:06:54',NULL,'2025-06-15 01:04:00','2025-06-15 02:06:54');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('9vWyoJuszjucrhiRZURniDKp6NMIOvbU6yNXCM1W',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36','YTo3OntzOjY6Il90b2tlbiI7czo0MDoic1BPZUJvZXB2eWVHTEROSGcwOXVTcUdwbVFlT3RzOEFFM1RXa3RpZyI7czozOiJ1cmwiO2E6MDp7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjA6IiQyeSQxMiRMaUNjL1dLbmNHNWRTYTVPaXNtOHFPaExaeXZtdzgzdFA3azM0ZlBLd1RRMzZuODFYc2FDbSI7czo0MDoiNDgwNDBlZjdmMjU0MmIzOWI5YmE5YTcyOTgzYjBkODhfZmlsdGVycyI7YToyOntzOjk6InN0YXJ0RGF0ZSI7TjtzOjc6ImVuZERhdGUiO047fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI3OiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYWRtaW4iO319',1749973890);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@mail.com',NULL,'$2y$12$LiCc/WKncG5dSa5Oism8qOhLZyvmw83tP7k34fPKwTQ36n81XsaCm','j7HAVTEd43QkWSHm4kzTHi6a3x6I1LqlwZfnpz6xmTP9sEuegD31V9NXxkZ4','2025-05-01 09:56:07','2025-05-01 09:56:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 22:17:32
