import os
import tweepy
from flask import Flask, request, jsonify, redirect, session, send_from_directory, render_template
import json
import time
import random

# --- Mock Data to simulate a personal profile and followed users ---
MOCK_USER_PROFILE = {
    "name": "Your Name",
    "handle": "your_handle_123",
    "avatar_url": "https://placehold.co/150x150/06B6D4/ffffff?text=ME",
}

# --- Mock Data to simulate Twitter API response ---
# Using more generic names and varied placeholder images
MOCK_USERS = [
    {"id": 1, "name": "Innovate Labs", "handle": "innovatelabs", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/A3E635/000000?text=IL"},
    {"id": 2, "name": "Quantum Dynamics", "handle": "quantumdyn", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/FACC15/000000?text=QD"},
    {"id": 3, "name": "Global News Hub", "handle": "globalnews", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/8B5CF6/ffffff?text=GH"},
    {"id": 4, "name": "Creative Studios", "handle": "creativestudios", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/F472B6/000000?text=CS"},
    {"id": 5, "name": "Data Insights Co.", "handle": "datainsights", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/60A5FA/000000?text=DI"},
    {"id": 6, "name": "Digital Trends", "handle": "digitaltrends", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/34D399/000000?text=DT"},
    {"id": 7, "name": "Eco Solutions", "handle": "ecosolutions", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/67E8F9/000000?text=ES"},
    {"id": 8, "name": "NextGen Gaming", "handle": "nextgengaming", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/C084FC/000000?text=NG"},
    {"id": 9, "name": "Financial Daily", "handle": "financialdaily", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/E879F9/000000?text=FD"},
    {"id": 10, "name": "Web Dev World", "handle": "webdevworld", "score": random.randint(10, 100), "avatar_url": "https://placehold.co/100x100/94A3B8/000000?text=WD"},
]

# Initialize the Flask application
# Using the default 'static' and 'templates' folders.
app = Flask(__name__)
app.secret_key = os.urandom(24)

# --- In-memory store for user sessions and access tokens ---
# In a real app, this should be a secure, persistent database.
user_sessions = {}

# --- Flask Routes ---

@app.route("/")
def serve_index():
    """
    Serves the main HTML template from the 'templates' directory.
    This is the standard and recommended way to serve HTML files in Flask.
    """
    return render_template("twitter_unfollow_manager.html")


@app.route("/auth/twitter", methods=["GET"])
def twitter_auth():
    """Simulates the Twitter OAuth 1.0a authentication flow."""
    user_id = "mock_user_12345"
    user_sessions[user_id] = {"token": "mock_token", "secret": "mock_secret"}
    
    return jsonify({"redirect_url": f"/?user_id={user_id}"})


@app.route("/callback")
def twitter_callback():
    """Handles the callback from Twitter after user authorization."""
    return redirect("/")


@app.route("/api/followed_users", methods=["GET"])
def get_followed_users():
    """Returns mock followed users."""
    user_id = request.args.get('user_id')
    user_session = user_sessions.get(user_id)

    if not user_session:
        return jsonify({"error": "Unauthorized"}), 401
    
    sorted_followers = sorted(MOCK_USERS, key=lambda user: user["score"])
    
    time.sleep(1) 
    
    return jsonify({"users": sorted_followers})


@app.route("/api/user_profile", methods=["GET"])
def get_user_profile():
    """Returns the mock user profile."""
    return jsonify(MOCK_USER_PROFILE)


@app.route("/api/unfollow", methods=["POST"])
def unfollow_users():
    """Simulates unfollowing selected users."""
    data = request.json
    user_id = data.get('user_id')
    unfollow_ids = data.get('unfollow_ids', [])
    user_session = user_sessions.get(user_id)

    if not user_session or not unfollow_ids:
        return jsonify({"error": "Unauthorized or no users selected."}), 401

    print(f"User {user_id} is unfollowing the following mock user IDs: {unfollow_ids}")
    
    time.sleep(1)
    
    return jsonify({"message": "Unfollow successful."})


@app.route("/api/disconnect", methods=["POST"])
def disconnect():
    """Clears the user session and access tokens."""
    data = request.json
    user_id = data.get('user_id')
    
    if user_id in user_sessions:
        del user_sessions[user_id]
        print(f"User {user_id} has disconnected.")
        return jsonify({"message": "Disconnected successfully."})
        
    return jsonify({"error": "User session not found."}), 404


if __name__ == "__main__":
    app.run(debug=True)
