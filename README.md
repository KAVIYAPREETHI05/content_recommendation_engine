# 📚 Content Recommendation System

A full-stack AI-powered content platform where **Creators** can post blogs and receive AI-generated topic suggestions, while **Readers** can explore trending, recommended, and engaging blogs tailored to their interests.

Built using **React**, **Node.js**, **Express**, and **MongoDB**, with smart insights powered by **OpenAI**.

---

## ⚙️ Tech Stack

- **Frontend**: React, React Router, Axios, Chart.js, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Database**: MongoDB (MongoDB Atlas)
- **AI Tools**: OpenAI API (optional)

---

## 🚀 Features

### 🔐 Authentication
- Reader and Creator login/signup with JWT
- Role-based access and personalized onboarding
- Profile settings with interest preferences

---

### ✍️ Creator Capabilities
- Create, edit, and manage blog posts with a rich text editor
- Categorize content with tags and topics
- View engagement analytics and reader insights


---

### 👨‍💻 Reader Capabilities
- Explore blogs: Recommended, Trending, and Others
- Search by title, author, or category
- Like, comment on, and save posts
- View personalized reading analytics

---

## Frontend Setup

### Install frontend dependencies

``npm install``


### Required frontend packages

``react-router-dom`` – Routing

``axios`` – API calls

``react-icons`` – Icons

``chart.js & react-chartjs-2`` – Graphs and pie charts

```npm install react-router-dom axios react-icons chart.js react-chartjs-2``


### Start frontend app

``npm start``

```Frontend runs at: http://localhost:3000```


## Backend Setup

###  Initialize Node Project

``npm init -y``

### Install dependencies
``npm install express mongoose cors dotenv bcryptjs jsonwebtoken``

### Required backend packages
``express`` – Web framework

``mongoose`` – MongoDB ODM

``cors`` – Enables cross-origin requests

``dotenv`` – Loads environment variables

``jsonwebtoken`` – Auth tokens

``bcryptjs`` – Password hashing

``npm install express mongoose cors dotenv jsonwebtoken bcryptjs``

### Start backend server

``nodemon app.js``
 ``` Backend runs at: http://localhost:5000 ```



## 🔁 API Communication
The frontend communicates with backend APIs via Axios using the base URL:

``` REACT_APP_API_BASE_URL=http://localhost:5000```

All requests (login, signup, post creation, etc.) 


## 📊 Visualization Features
The platform includes:

Bar Charts (e.g., likes per category)

Pie Charts (e.g., reader demographics)

Built using chart.js and react-chartjs-2

## Project Design

[Figma Design](https://www.figma.com/design/jHXJ5rOIdA3SDmCEItOQ5X/content_blog?node-id=0-1&p=f&t=ldE7Hz7m8CHSn8i9-0)

## Test report

[Test Report PDF](https://docs.google.com/document/d/1bX6aE0Kj--KOsm3dqKDCo9azr9aJfW7r/edit?usp=sharing&ouid=109807329531465232704&rtpof=true&sd=true)

[Download Project Documentation (PDF)](./docs/TestReport.pdf)


## Flow Diagram
![image](https://github.com/user-attachments/assets/9c34f857-4094-446e-9ddd-2af61de714bb)







