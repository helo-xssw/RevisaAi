import jwt
from datetime import datetime, timedelta

SECRET_KEY = "MEGA_SECRET_KEY"
ALGORITHM = "HS256"

def create_token(data: dict):
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
