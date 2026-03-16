import pandas as pd
import numpy as np

# Grade average interest rate from training
grade_avg_map = {
    1: 7.5,
    2: 9.3,
    3: 11.2,
    4: 13.4,
    5: 15.7,
    6: 17.8,
    7: 19.5
}


def preprocess(df):

    df = df.copy()

    # =========================
    # EMP LENGTH HANDLING
    # =========================
    
    emp_map = {
        "< 1 year": 0,
        "1 year": 1,
        "2 years": 2,
        "3 years": 3,
        "4 years": 4,
        "5 years": 5,
        "6 years": 6,
        "7 years": 7,
        "8 years": 8,
        "9 years": 9,
        "10+ years": 10
    }

    df["emp_length"] = df["emp_length"].map(emp_map)

    # unknown flag
    df["emp_unknown"] = df["emp_length"].isna().astype(int)

    # fill missing with median
    median_emp = 6
    df["emp_length"] = df["emp_length"].fillna(median_emp).astype(int)
    # Verification status mapping
    df["verification_status"] = df["verification_status"].map({
        "Not Verified": 0,
        "Source Verified": 1,
        "Verified": 2
    })
    # Grade mapping
    df["grade"] = df["grade"].map({
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 5,
        "F": 6,
        "G": 7
    })
    # Home ownership mapping
    df["home_ownership"] = df["home_ownership"].map({
        "RENT": 0,
        "MORTGAGE": 1,
        "OWN": 2,
        "OTHER": 3
    })
    # Ratio Features
    df["loan_to_income"] = df["loan_amnt"] / df["annual_inc"]
    df["installment_to_income"] = df["installment"] / df["annual_inc"]
    df["loan_to_installment"] = df["loan_amnt"] / df["installment"]
    df["dti_to_income"] = df["dti"] / df["annual_inc"]
    # FICO category
    df["fico_category"] = pd.cut(
    df["fico_score"],
    bins=[300,580,670,740,800,850],
    labels=[0,1,2,3,4]
)

    df["fico_category"] = pd.to_numeric(df["fico_category"], errors="coerce")
    df["fico_category"] = df["fico_category"].fillna(2).astype(int)
    df["fico_rate_mismatch"] = df["int_rate"] / df["fico_score"]
    # Credit history ratios
    df["inq_to_open_acc"] = df["inq_last_6mths"] / (df["open_acc"] + 1)

    df["delinq_rate"] = df["delinq_2yrs"] / (df["total_acc"] + 1)

    df["acc_utilization"] = df["open_acc"] / (df["total_acc"] + 1)
    # Revolving utilization and interest rate flags
    df["high_revol_util"] = (df["revol_util"] > 80).astype(int)

    df["high_int_rate"] = (df["int_rate"] > 15).astype(int)
    # Rate vs Grade Average
    df["rate_vs_grade_avg"] = df["int_rate"] - df["grade"].map(grade_avg_map)
    # Income per year of employment
    df["income_per_emp_year"] = df["annual_inc"] / (df["emp_length"] + 1)

    df["stable_employment"] = (df["emp_length"] >= 5).astype(int)
    # Risk score 
    df["risk_score"] = (
        df["dti"] * 0.3 +
        df["int_rate"] * 0.3 +
        df["inq_last_6mths"] * 0.2 +
        df["delinq_2yrs"] * 0.2
    )
    # High risk flag
    df["high_risk"] = (
        (df["dti"] > 30) &
        (df["int_rate"] > 15) &
        (df["delinq_2yrs"] > 0)
    ).astype(int)
    # Interaction term
    df["term_rate_interaction"] = df["term"] * df["int_rate"]
    # Log transformations
    df["log_annual_inc"] = np.log1p(df["annual_inc"])

    df["log_loan_amnt"] = np.log1p(df["loan_amnt"])
    return df
    