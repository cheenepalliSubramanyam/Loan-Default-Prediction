from pydantic import BaseModel


class LoanRequest(BaseModel):

    loan_amnt: float
    term: int
    int_rate: float
    installment: float
    grade: str
    emp_length: int
    home_ownership: str
    annual_inc: float
    verification_status: str
    dti: float
    delinq_2yrs: int
    inq_last_6mths: int
    open_acc: int
    revol_util: float
    total_acc: int
    fico_score: int