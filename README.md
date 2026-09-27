# LeadAI – AI Lead Research Assistant

LeadAI is a full-stack web application that helps sales and growth teams organize, research, score, and prioritize potential business leads.

The application combines a Java Spring Boot backend, MongoDB database, and a responsive web dashboard to turn basic company information into actionable lead insights.

## 🚀 Features

- 🔐 User signup and login
- 🔒 BCrypt password hashing
- 📊 Lead scoring and prioritization
- 🤖 AI-assisted lead analysis and research summaries
- 🏷️ Automatic HIGH / MEDIUM / LOW priority classification
- 🔎 Lead search and priority filtering
- 📋 Lead details and recommendations
- 📈 Dashboard analytics
- 🗄️ MongoDB persistence
- 🌐 REST APIs using Spring Boot
- 🔐 Environment-variable based database configuration

## 🛠️ Tech Stack

**Backend**
- Java 17
- Spring Boot
- Spring Data MongoDB
- REST APIs
- Maven

**Database**
- MongoDB Atlas

**Frontend**
- HTML
- CSS
- JavaScript
- Browser Local Storage

**Security**
- BCrypt password hashing

## 🧠 How LeadAI Works

1. A user creates an account and logs in.
2. The user adds information about a potential lead.
3. LeadAI analyzes business signals such as:
   - Industry
   - Country
   - International sales
   - Website availability
   - Lead description
4. A lead score is calculated.
5. The lead is classified as HIGH, MEDIUM, or LOW priority.
6. The system generates an analysis and recommended next action.
7. Lead information is stored in MongoDB and displayed on the dashboard.

## 📊 Lead Prioritization

The application uses business signals to calculate a lead score.

| Priority | Meaning |
|----------|---------|
| HIGH | Strong potential for immediate outreach |
| MEDIUM | Worth further research and nurturing |
| LOW | Lower-priority opportunity |

## 🏗️ Project Architecture

```text
Frontend
   │
   │ REST API
   ▼
Spring Boot Backend
   │
   ├── Authentication
   ├── Lead Management
   ├── Lead Research
   └── Lead Analysis
   │
   ▼
MongoDB Atlas

## ▶️ How to Run

### Prerequisites
- Java 17
- Maven
- MongoDB Atlas

### Backend
1. Set the MONGODB_URI environment variable.
2. Run:

./mvnw spring-boot:run

### Application
Open:

http://localhost:8080
