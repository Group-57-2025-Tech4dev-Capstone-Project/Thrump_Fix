# # ---------- STAGE 1: BUILD FRONTEND ----------
# FROM node:20-alpine AS frontend
# WORKDIR /app/frontend
#
# COPY Frontend/package*.json ./
# RUN npm install
#
# COPY Frontend .
# RUN npm run dev
#
#
# # ---------- STAGE 2: BUILD BACKEND ----------
# FROM maven:3.9-eclipse-temurin-21 AS build
# WORKDIR /app
#
# COPY pom.xml .
# COPY src ./src
#
# # copy React build output into Spring Boot static folder
# COPY --from=frontend /app/frontend/dist ./src/main/resources/static
#
# RUN mvn clean package -DskipTests
#
#
# # ---------- STAGE 3: PRODUCTION IMAGE ----------
# FROM eclipse-temurin:21-jdk
# WORKDIR /app
#
# COPY --from=build /app/target/*.jar app.jar
#
# EXPOSE 8081
# ENTRYPOINT ["java","-jar","app.jar"]


# ---------- STAGE 1: BUILD FRONTEND ----------
FROM node:20-alpine AS frontend
WORKDIR /app/frontend

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend .
RUN npm run build


# ---------- STAGE 2: BUILD BACKEND ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Copy React build output into Spring Boot static folder
COPY --from=frontend /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# ---------- STAGE 3: PRODUCTION IMAGE (SLIM) ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
