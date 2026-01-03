from pydantic import BaseModel

class Test(BaseModel):
    name: str

t = Test(name='test')
print('Pydantic works')