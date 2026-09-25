from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse
    token: str