from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BlogPostContent(BaseModel):
    type: str
    text: Optional[str] = None
    items: Optional[List[str]] = None
    headers: Optional[List[str]] = None
    rows: Optional[List[List[str]]] = None

class BlogPost(BaseModel):
    id: str
    title: str
    excerpt: str
    date: str
    image: Optional[str] = None
    imageAlt: Optional[str] = None
    keywords: Optional[str] = None
    metaDescription: Optional[str] = None
    focusKeyword: Optional[str] = None
    content: List[BlogPostContent]

class BlogPostCreate(BaseModel):
    id: str
    title: str
    excerpt: str
    date: str
    image: Optional[str] = None
    imageAlt: Optional[str] = None
    keywords: Optional[str] = None
    metaDescription: Optional[str] = None
    focusKeyword: Optional[str] = None
    content: List[BlogPostContent]

class AdminLogin(BaseModel):
    password: str
