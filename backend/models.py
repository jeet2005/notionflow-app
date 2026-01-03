from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime

# Data Structures (DS) for the application

class User(BaseModel):
    id: str
    email: str
    display_name: Optional[str]
    created_at: str
    updated_at: str

class Page(BaseModel):
    id: str
    title: str
    content: str
    user_id: str
    created_at: str  # ISO string from DB
    updated_at: str  # ISO string from DB

class PageCreate(BaseModel):
    title: str
    content: str

class PageUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]

class UserCreate(BaseModel):
    email: str
    password: str
    display_name: Optional[str]

class UserLogin(BaseModel):
    email: str
    password: str

# Data Structure implementations
class PageManager:
    """Data Structure for managing pages with efficient operations"""

    def __init__(self):
        self.pages = {}  # id -> Page
        self.user_pages = {}  # user_id -> list of page_ids

    def add_page(self, page: Page):
        self.pages[page.id] = page
        if page.user_id not in self.user_pages:
            self.user_pages[page.user_id] = []
        self.user_pages[page.user_id].append(page.id)

    def get_page(self, page_id: str) -> Optional[Page]:
        return self.pages.get(page_id)

    def get_user_pages(self, user_id: str) -> list[Page]:
        page_ids = self.user_pages.get(user_id, [])
        return [self.pages[pid] for pid in page_ids if pid in self.pages]

    def update_page(self, page_id: str, updates: dict) -> Optional[Page]:
        if page_id not in self.pages:
            return None
        page = self.pages[page_id]
        if "title" in updates and updates["title"] is not None:
            page.title = updates["title"]
        if "content" in updates and updates["content"] is not None:
            page.content = updates["content"]
        page.updated_at = datetime.utcnow().isoformat()
        return page

    def delete_page(self, page_id: str) -> bool:
        if page_id not in self.pages:
            return False
        page = self.pages[page_id]
        self.user_pages[page.user_id].remove(page_id)
        del self.pages[page_id]
        return True

# Global instance for in-memory operations (can be replaced with DB calls)
page_manager = PageManager()