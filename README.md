# Twitter Unfollow Manager

## Project Overview
This single-page web application helps users identify and manage accounts that have recently unfollowed them on Twitter (X). It provides a clean, user-friendly interface to view unfollowers and perform bulk unfollow actions. The backend is powered by Python using Flask, and the frontend is built with a single HTML file styled with Tailwind CSS for a modern, responsive design.

This project uses mock data to simulate Twitter API interactions for demonstration purposes, including authentication, user data fetching, and unfollow actions.

## Features
- **Mock Authentication**: Simulates Twitter login for demo purposes.
- **User Profile Display**: Shows mock user details (name, handle, avatar).
- **Unfollower List**: Lists mock accounts that have unfollowed the user.
- **Unfollow Action**: Enables bulk unfollowing of selected accounts with one click.
- **Responsive Design**: Uses Tailwind CSS for seamless desktop and mobile experiences.

## How to Run Locally

### Prerequisites
- Python and pip installed on your system.

### Set Up Your Environment
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

### Install Dependencies
Install required Python packages:
```bash
pip install -r requirements.txt
```

### Run the Application
Start the Flask server:
```bash
python api/index.py
```
Access the app at `http://localhost:5000` in your web browser.

## Deployment to Render
This application is configured for deployment on Render, a cloud platform for hosting web services.

### Prerequisites
- A GitHub account with this project in a repository.
- A Render account (free tier available).

### Deployment Steps
1. Log in to your Render dashboard and click **New > Web Service**.
2. Connect your GitHub account and select this project’s repository.
3. Configure the service:
   - **Name**: Choose a unique name.
   - **Root Directory**: Leave blank.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api.index:app`
   - **Instance Type**: Select Free.
4. Click **Create Web Service**.
Render will build and deploy the app, providing a live URL.

## Contributing
Contributions are welcome! Fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.