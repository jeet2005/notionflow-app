from models import User

# Test creating a user
user = User(
    id="test",
    email="test@example.com",
    display_name="Test User",
    created_at="2023-01-01T00:00:00",
    updated_at="2023-01-01T00:00:00"
)
print("User created successfully:", user)