# SkillBridge 

SkillBridge is a platform that connects clients and freelancers

### Steps:

# CLIENT:

- Register and login as a client.

- Initially add some funds from the wallet page.

- Then go to "Post a Task" and create a new task. Assign an amount to it or ask AI to generate it, it will generate a milestone based task. For your own initial task, freelancers can bid their own amount, but for AI created tasks, they cannot.. this highlights the difference between fixed and non fixed pricing.

- Wait for bids, then accept a bid. You can also chat with any freelancer who made a bid on your project for any extra clarification.

- After completion, you can see the submitted work and release the freelancer's funds, then rate your freelancer :)

# FREELANCER:

- Register and login as a freelancer.

- Go to "Browse Jobs" and check for all jobs or a specific job.

- Apply for a job and place a bid. You can only place a custom amount on jobs that have no AI milestones otherwise, the bid amount is fixed.

- Then wait until the client accepts and starts the work.

- If it is a whole project, submit the whole work; if it is milestone-based, submit each milestone's work. The client will approve and release funds accordingly.

- You can also chat with the client if you have any queries or need extra information:)


# Local Setup Guide

Follow these steps

### 1. Clone the Repository

```bash
git clone https://github.com/sadwiik06/SkillBridge.git
cd SkillBridge
```


### 2. Configure Backend

#### Configure Backend Environment
Navigate to the skillbridge-backend directory and create your .env file from the provided template .env.example

```bash
cd skillbridge-backend
cp .env.example .env
```
Open .env and fill in your credentials:

#### Run the Spring Boot Server

- **On macOS/Linux**:
  ```bash
  chmod +x mvnw
  ./mvnw spring-boot:run
  ```

- **On Windows (PowerShell / CMD)**:
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```

The backend API will start at: http://localhost:8080



### 3. Configure Frontend

```bash
cd skillbridge-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start the Development Server
```bash
npm run dev
```

The frontend client will start at: http://localhost:5173 :)

