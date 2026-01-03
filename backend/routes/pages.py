from fastapi import APIRouter, HTTPException, Depends
from typing import List
import database
from models import Page, PageCreate, PageUpdate, page_manager
from datetime import datetime

router = APIRouter()

# Dependency to get database
def get_db():
    return database.get_db()

@router.get("/", response_model=List[Page])
async def get_pages(user_id: str, db=Depends(get_db)):
    """Get all pages for a user"""
    try:
        # For now, using in-memory manager. Replace with DB query
        pages = page_manager.get_user_pages(user_id)
        return pages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Page)
async def create_page(page: PageCreate, user_id: str, db=Depends(get_db)):
    """Create a new page"""
    try:
        page_id = f"page_{datetime.utcnow().timestamp()}"
        new_page = Page(
            id=page_id,
            title=page.title,
            content=page.content,
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        page_manager.add_page(new_page)
        return new_page
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{page_id}", response_model=Page)
async def get_page(page_id: str, user_id: str, db=Depends(get_db)):
    """Get a specific page"""
    page = page_manager.get_page(page_id)
    if not page or page.user_id != user_id:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@router.put("/{page_id}", response_model=Page)
async def update_page(page_id: str, page_update: dict, user_id: str, db=Depends(get_db)):
    """Update a page"""
    page = page_manager.get_page(page_id)
    if not page or page.user_id != user_id:
        raise HTTPException(status_code=404, detail="Page not found")

    updated_page = page_manager.update_page(page_id, page_update)
    if not updated_page:
        raise HTTPException(status_code=500, detail="Failed to update page")
    return updated_page

@router.delete("/{page_id}")
async def delete_page(page_id: str, user_id: str, db=Depends(get_db)):
    """Delete a page"""
    page = page_manager.get_page(page_id)
    if not page or page.user_id != user_id:
        raise HTTPException(status_code=404, detail="Page not found")

    if not page_manager.delete_page(page_id):
        raise HTTPException(status_code=500, detail="Failed to delete page")
    return {"message": "Page deleted successfully"}