import os
import base64
import logging
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from datetime import datetime
from flask import Flask, jsonify, send_from_directory


# === SETTINGS ===
SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]
WALLPAPER_FOLDER = "/Users/faraimakombe/Desktop/Wallpapers"
SEARCH_QUERY = "from:me subject:WallpaperDrop has:attachment is:unread"
app = Flask(__name__)

logging.basicConfig(
    filename="/tmp/wallpaperscript.log", level=logging.INFO, format="%(message)s"
)
logging.getLogger("googleapiclient.discovery_cache").setLevel(logging.ERROR)

# =================


@app.route("/api/wallpapers")
def list_wallpapers():
    files = [
        f for f in os.listdir(WALLPAPER_FOLDER) if f.endswith((".jpg", ".jpeg", ".png"))
    ]
    return jsonify(files)


@app.route("/wallpapers/<filename>")
def get_wallpaper(filename):
    return send_from_directory(WALLPAPER_FOLDER, filename)


if __name__ == "__main__":
    app.run(port=5001)


def log(message, filename):
    now = datetime.now()
    date_part = now.strftime("%m/%d/%y")
    time_part = now.strftime("%-I:%M %p")
    padded_filename = f"{message}: {filename}".ljust(40)
    logging.info(f"{date_part}   {padded_filename} {time_part}")


def authenticate():
    creds = None

    # Dynamically get the current script's directory
    base_dir = os.path.dirname(os.path.abspath(__file__))

    creds_path = os.path.join(base_dir, "credentials.json")
    token_path = os.path.join(base_dir, "token.json")

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as token:
            token.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def fetch_image_attachments(service):
    results = service.users().messages().list(userId="me", q=SEARCH_QUERY).execute()
    messages = results.get("messages", [])

    for msg in messages:
        msg_data = service.users().messages().get(userId="me", id=msg["id"]).execute()
        for part in msg_data["payload"].get("parts", []):
            if part["filename"] and "image" in part["mimeType"]:
                att_id = part["body"].get("attachmentId")
                if att_id:
                    att = (
                        service.users()
                        .messages()
                        .attachments()
                        .get(userId="me", messageId=msg["id"], id=att_id)
                        .execute()
                    )

                    data = base64.urlsafe_b64decode(att["data"])
                    save_path = os.path.join(WALLPAPER_FOLDER, part["filename"])

                    if os.path.exists(save_path):
                        log("Skipped (already exists)", os.path.basename(save_path))
                        continue

                    with open(save_path, "wb") as f:
                        f.write(data)
                    log("Downloaded", os.path.basename(save_path))

        service.users().messages().modify(
            userId="me", id=msg["id"], body={"removeLabelIds": ["UNREAD"]}
        ).execute()


def main():
    service = authenticate()
    fetch_image_attachments(service)


if __name__ == "__main__":
    main()
