🚰 Thrump Fix — MVP
🌍 Overview

Thrump Fix is a web application that connects households and businesses with verified professional plumbers for urgent plumbing needs across Nigeria.
The platform enables users to quickly locate nearby plumbers, request services and resolve water leaks and sanitation issues before they escalate.

💧 Why This Matters
Nigeria faces significant challenges related to water loss, sanitation and infrastructure maintenance. 
Undetected leaks, burst pipes, and poor plumbing systems contribute to:
water wastage
property damage
sanitation hazards
increased utility costs
public health risks

Thrump Fix directly contributes to the United Nations Sustainable Development Goal 6 (SDG 6): Clean Water & Sanitation by:
reducing water loss through rapid leak repair
improving sanitation conditions
enabling timely maintenance of water systems
promoting responsible water usage
supporting sustainable infrastructure

⚙️ Role of Spring Boot
Spring Boot powers the backend to ensure:
scalable REST APIs
secure authentication & authorization
rapid service delivery
production-ready architecture
seamless database integration
This ensures urgent plumbing issues are resolved efficiently.

📑 Table of Contents
Overview
Why This Matters
Technology Stack
Requirements & Prerequisites
Installation & Setup
Building & Running
Testing
Core MVP Features
Future Enhancements
Project Structure
Authors
Acknowledgements
License

🧰 Technology Stack
Backend:
Java 21
Spring Boot 3.5.10
Spring Security + JWT
Spring Data JPA (Hibernate)
MySQL
Tools & Libraries
Lombok
ModelMapper
Validation API
Maven
Testing
Postman 


⚙️ Requirements & Prerequisites
Install:
Java JDK 21
Apache Maven
MySQL Server
IDE (IntelliJ IDEA / VS Code / Eclipse)

📦 Key Dependencies
Spring Web
Spring Security
Spring Data JPA
JWT Authentication
MySQL Connector
Hibernate ORM
Lombok
Validation API

⚠️ Images are stored in the database (BLOB) for MVP reliability.
🛠 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/thrump-fix.git
cd thrump-fix
2️⃣ Create Database
CREATE DATABASE thrump_fix;
3️⃣ Configure Application Properties

Update:

src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/thrump_fix
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

4️⃣ Install Dependencies
mvn clean install
▶️ Building & Running
Run using Maven
./mvnw spring-boot:run
Build & run JAR
./mvnw clean install
java -jar target/thrump-fix.jar
▶️ Run in IDE
Open project
Locate @SpringBootApplication class
Right-click → Run

🧪 Testing
Testing has been performed using:
Postman
JWT authentication tests
Role-based access tests
Multipart upload tests
Planned Testing Improvements:
Unit Tests (JUnit & Mockito)
Integration Testing
CI/CD automated testing

🚀 Core MVP Features
✔ User registration & login (JWT secured)
✔ Role-based authorization (Admin / Plumber / Customer)
✔ Plumber profile & certification management
✔ Availability status updates
✔ Search plumbers by name & location
✔ Secure image storage
✔ RESTful API architecture

🌱 Future Enhancements
Real-time plumber tracking
AI-assisted plumber matching
Mobile app integration
Payment gateway integration
Ratings & reviews
Push notifications
Cloud storage & CDN optimization

📁 Project Structure
src/main/java/com.WTFCapestone.Capestone
│
├── config          → Security & configuration
├── controller      → REST controllers
├── service         → Business logic
├── repository      → Data access layer
├── entity          → Database models
├── dto             → Request & response models
└── security        → JWT & authentication
└── exception       → Custom exception handling
└── util            → Utilities

👨‍💻 Authors

Charity Pabazhira
Full Stack Developer passionate about building scalable solutions that solve real-world problems.

🙏 Acknowledgements
Special thanks to:
Spring Boot community & documentation
Open-source contributors
SDG 6 sustainability initiatives
Nigerian infrastructure & water conservation advocates

📜 License

This project is licensed under the MIT License.