from fastapi import FastAPI, Request, Response, Depends, HTTPException, Form, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from pydantic import BaseModel
from typing import Optional, List
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from uuid import uuid4
import secrets
from fastapi.templating import Jinja2Templates
from pathlib import Path
from starlette.middleware.sessions import SessionMiddleware

# 資料庫設定
SQLALCHEMY_DATABASE_URL = "sqlite:///./blog.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()  # 這裡使用的是不會有警告

# 資料模型
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    email = Column(String)

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    user_id = Column(Integer)

# 創建資料表
Base.metadata.create_all(bind=engine)

# 依賴項
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 初始化 FastAPI
app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="your-secret-key")

# 設置模板
templates = Jinja2Templates(directory="templates")

# 首頁
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request, db: Session = Depends(get_db)):
    # 獲取所有貼文
    posts = db.query(Post).all()
    
    # 檢查用戶是否已登入
    user_id = request.session.get("user_id")
    username = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            username = user.username
    
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "posts": posts, "user_id": user_id, "username": username}
    )

# 註冊頁面
@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

# 處理註冊
@app.post("/signup")
async def signup(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    # 檢查用戶名是否已存在
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        return templates.TemplateResponse(
            "signup.html", 
            {"request": request, "error": "Username already exists"}
        )
    
    # 創建新用戶
    new_user = User(username=username, password=password, email=email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 設置 session
    request.session["user_id"] = new_user.id
    
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

# 登入頁面
@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# 處理登入
@app.post("/login")
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # 檢查用戶名和密碼
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password != password:
        return templates.TemplateResponse(
            "login.html", 
            {"request": request, "error": "Invalid username or password"}
        )
    
    # 設置 session
    request.session["user_id"] = user.id
    
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

# 登出
@app.get("/logout")
async def logout(request: Request):
    request.session.pop("user_id", None)
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

# 新增貼文頁面
@app.get("/post/new", response_class=HTMLResponse)
async def new_post_page(request: Request):
    # 檢查用戶是否已登入
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    
    return templates.TemplateResponse("new_post.html", {"request": request})

# 處理新增貼文
@app.post("/post/new")
async def create_post(
    request: Request,
    title: str = Form(...),
    content: str = Form(...),
    db: Session = Depends(get_db)
):
    # 檢查用戶是否已登入
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    
    # 創建新貼文
    new_post = Post(title=title, content=content, user_id=user_id)
    db.add(new_post)
    db.commit()
    
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

# 刪除貼文
@app.get("/post/{post_id}/delete")
async def delete_post(
    request: Request,
    post_id: int,
    db: Session = Depends(get_db)
):
    # 檢查用戶是否已登入
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    
    # 獲取貼文
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # 檢查是否是貼文的作者
    if post.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    # 刪除貼文
    db.delete(post)
    db.commit()
    
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

# 啟動應用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
