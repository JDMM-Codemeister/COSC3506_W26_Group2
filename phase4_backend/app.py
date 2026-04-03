# Backend API for COSC3506 Group Project
# Handles user authentication, file uploads, and reminders
# Built using Flask + SQLite (SQLAlchemy)


from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import uuid

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"pdf"}


# Models
class User(db.Model):
    __tablename__ = "users"

    userId = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    preferences = db.Column(db.String(200), nullable=True)


class ReadingMaterial(db.Model):
    __tablename__ = "reading_materials"

    materialId = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    filePath = db.Column(db.String(255), nullable=False)
    uploadedAt = db.Column(db.DateTime, default=datetime.utcnow)


def is_allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def serialize_file(file_record):
    stored_filename = os.path.basename(file_record.filePath)
    return {
        "id": file_record.materialId,
        "title": file_record.title,
        "filePath": file_record.filePath,
        "fileUrl": f"http://127.0.0.1:5000/uploads/{stored_filename}",
        "uploadedAt": file_record.uploadedAt.isoformat()
    }


# Routes
@app.route("/")
def home():
    return "Backend running"




# Register a new user
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    user = User(
        fullName=data.get("fullName", "Default User"),
        email=data["email"],
        password=data["password"],
        preferences=data.get("preferences", "")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "registered",
        "user": {
            "userId": user.userId,
            "fullName": user.fullName,
            "email": user.email,
            "preferences": user.preferences
        }
    })

# Login user
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(
        email=data["email"],
        password=data["password"]
    ).first()

    if user:
        return jsonify({
            "message": "login success",
            "user": {
                "userId": user.userId,
                "fullName": user.fullName,
                "email": user.email,
                "preferences": user.preferences
            }
        })
    else:
        return jsonify({"message": "login failed"}), 401

# Upload file
@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["file"]
    user_id = request.form.get("user_id", type=int)

    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    if file.filename == "":
        return jsonify({"message": "File name is empty"}), 400

    if not is_allowed_file(file.filename):
        return jsonify({"message": "Only PDF files are allowed"}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    safe_filename = secure_filename(file.filename)
    name_without_ext, extension = os.path.splitext(safe_filename)
    unique_filename = f"{name_without_ext}_{uuid.uuid4().hex[:8]}{extension.lower()}"

    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)

    new_file = ReadingMaterial(
        userId=user_id,
        title=safe_filename,
        content="",
        filePath=filepath
    )

    db.session.add(new_file)
    db.session.commit()

    return jsonify({
        "message": "uploaded",
        "file": serialize_file(new_file)
    })

# Get all files for user
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/files/<int:user_id>")
def get_files(user_id):
    files = ReadingMaterial.query.filter_by(userId=user_id).all()

    result = [serialize_file(f) for f in files]

    return jsonify(result)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)