import { useState } from "react";
import axios from "axios";

function App() {

const initialFormData = {
  loan_amnt:"",
  term:36,
  int_rate:"",
  installment:"",
  grade:"C",
  emp_length:"",
  home_ownership:"RENT",
  annual_inc:"",
  verification_status:"Verified",
  dti:"",
  delinq_2yrs:"",
  inq_last_6mths:"",
  open_acc:"",
  revol_util:"",
  total_acc:"",
  fico_score:""
};

const [formData, setFormData] = useState(initialFormData);
const [result, setResult] = useState(null);
const [errors, setErrors] = useState({});
const [riskLevel, setRiskLevel] = useState(null);
const [loading, setLoading] = useState(false);  // ← NEW


const preventInvalidNumberInput = (e)=>{
  if(["e","E","+","-"].includes(e.key)){
    e.preventDefault();
  }
};


const handleChange = (e)=>{
  let value = e.target.value;
  if(e.target.type === "number"){
    value = value === "" ? "" : parseFloat(value);
  }
  setFormData({...formData,[e.target.name]:value});
  if(value !== ""){
    setErrors({...errors,[e.target.name]:""});
  }
};


const validateForm = ()=>{
  let newErrors = {};
  Object.keys(formData).forEach((field)=>{
    if(formData[field] === "" || formData[field] === null){
      newErrors[field] = "This field is required";
    }
  });
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


// ← NEW - Clear Form Handler
const handleClear = () => {
  setFormData(initialFormData);
  setResult(null);
  setRiskLevel(null);
  setErrors({});
};


const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);  // ← Start loading
  setResult(null);
  setRiskLevel(null);

  try {
    const payload = {
      ...formData,
      loan_amnt: parseFloat(formData.loan_amnt),
      term: parseInt(formData.term),
      int_rate: parseFloat(formData.int_rate),
      installment: parseFloat(formData.installment),
      emp_length: parseInt(formData.emp_length),
      annual_inc: parseFloat(formData.annual_inc),
      dti: parseFloat(formData.dti),
      delinq_2yrs: parseInt(formData.delinq_2yrs),
      inq_last_6mths: parseInt(formData.inq_last_6mths),
      open_acc: parseInt(formData.open_acc),
      revol_util: parseFloat(formData.revol_util),
      total_acc: parseInt(formData.total_acc),
      fico_score: parseInt(formData.fico_score),
    };

    const res = await axios.post(
      "https://dhif1tb4ai.execute-api.ap-south-1.amazonaws.com/default/predict",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    setResult(res.data.default_risk_percent);
    setRiskLevel(res.data.risk_level);

  } catch (err) {
    console.error("Full error:", err);
    alert(`Error: ${err.response?.status} - ${JSON.stringify(err.response?.data) || err.message}`);
  } finally {
    setLoading(false);  // ← Stop loading always
  }
};


const inputStyle = (field)=>
  `w-full border rounded-lg p-3 pr-12 ${
    errors[field] ? "border-red-500" : "border-gray-300"
  }`;


return(
<div className="min-h-screen flex flex-col items-center p-10 bg-gradient-to-b from-gray-50 to-gray-200">

  <h1 className="text-3xl font-bold mb-2 text-gray-800">
    Loan Default Risk Predictor
  </h1>

  <p className="mb-10 text-gray-500">
    AI-powered credit risk assessment
  </p>

  <div className="bg-white shadow-xl rounded-xl p-10 w-[900px] space-y-8">

    {/* Loan Information */}
    <div className="bg-orange-100 border border-orange-200 p-6 rounded-xl">
      <h2 className="text-orange-800 font-semibold mb-5">Loan Information</h2>
      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="text-sm text-gray-600">Loan Amount</label>
          <div className="relative">
            <input name="loan_amnt" type="number" value={formData.loan_amnt} className={inputStyle("loan_amnt")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">$</span>
          </div>
          {errors.loan_amnt && <p className="text-red-500 text-sm mt-1">{errors.loan_amnt}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Interest Rate</label>
          <div className="relative">
            <input name="int_rate" type="number" value={formData.int_rate} className={inputStyle("int_rate")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">%</span>
          </div>
          {errors.int_rate && <p className="text-red-500 text-sm mt-1">{errors.int_rate}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Loan Term</label>
          <select name="term" value={formData.term} className={inputStyle("term")} onChange={handleChange}>
            <option value="36">36 months</option>
            <option value="60">60 months</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Installment</label>
          <div className="relative">
            <input name="installment" type="number" value={formData.installment} className={inputStyle("installment")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">/mo</span>
          </div>
          {errors.installment && <p className="text-red-500 text-sm mt-1">{errors.installment}</p>}
        </div>

      </div>
    </div>

    {/* Borrower Information */}
    <div className="bg-rose-100 border border-rose-200 p-6 rounded-xl">
      <h2 className="text-rose-800 font-semibold mb-5">Borrower Information</h2>
      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="text-sm text-gray-600">Annual Income</label>
          <div className="relative">
            <input name="annual_inc" type="number" value={formData.annual_inc} className={inputStyle("annual_inc")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">$</span>
          </div>
          {errors.annual_inc && <p className="text-red-500 text-sm mt-1">{errors.annual_inc}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Employment Length</label>
          <div className="relative">
            <input name="emp_length" type="number" value={formData.emp_length} className={inputStyle("emp_length")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">yrs</span>
          </div>
          {errors.emp_length && <p className="text-red-500 text-sm mt-1">{errors.emp_length}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Home Ownership</label>
          <select name="home_ownership" value={formData.home_ownership} className={inputStyle("home_ownership")} onChange={handleChange}>
            <option>RENT</option>
            <option>MORTGAGE</option>
            <option>OWN</option>
            <option>OTHER</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Verification Status</label>
          <select name="verification_status" value={formData.verification_status} className={inputStyle("verification_status")} onChange={handleChange}>
            <option>Verified</option>
            <option>Source Verified</option>
            <option>Not Verified</option>
          </select>
        </div>

      </div>
    </div>

    {/* Credit Information */}
    <div className="bg-emerald-100 border border-emerald-200 p-6 rounded-xl">
      <h2 className="text-emerald-800 font-semibold mb-5">Credit Information</h2>
      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="text-sm text-gray-600">Debt-to-Income Ratio</label>
          <div className="relative">
            <input name="dti" type="number" value={formData.dti} className={inputStyle("dti")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">%</span>
          </div>
          {errors.dti && <p className="text-red-500 text-sm mt-1">{errors.dti}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Past Due Accounts (Last 2 Years)</label>
          <input name="delinq_2yrs" type="number" value={formData.delinq_2yrs} className={inputStyle("delinq_2yrs")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
          {errors.delinq_2yrs && <p className="text-red-500 text-sm mt-1">{errors.delinq_2yrs}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Recent Credit Checks (Last 6 Months)</label>
          <input name="inq_last_6mths" type="number" value={formData.inq_last_6mths} className={inputStyle("inq_last_6mths")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
          {errors.inq_last_6mths && <p className="text-red-500 text-sm mt-1">{errors.inq_last_6mths}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Active Credit Accounts</label>
          <input name="open_acc" type="number" value={formData.open_acc} className={inputStyle("open_acc")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
          {errors.open_acc && <p className="text-red-500 text-sm mt-1">{errors.open_acc}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Credit Card Usage (%)</label>
          <div className="relative">
            <input name="revol_util" type="number" value={formData.revol_util} className={inputStyle("revol_util")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
            <span className="absolute right-3 top-2 text-gray-400">%</span>
          </div>
          {errors.revol_util && <p className="text-red-500 text-sm mt-1">{errors.revol_util}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Total Credit Accounts</label>
          <input name="total_acc" type="number" value={formData.total_acc} className={inputStyle("total_acc")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
          {errors.total_acc && <p className="text-red-500 text-sm mt-1">{errors.total_acc}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600">FICO Score</label>
          <input name="fico_score" type="number" value={formData.fico_score} className={inputStyle("fico_score")} onChange={handleChange} onKeyDown={preventInvalidNumberInput}/>
          {errors.fico_score && <p className="text-red-500 text-sm mt-1">{errors.fico_score}</p>}
        </div>

      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4">

      {/* Calculate Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex-1 bg-indigo-600 text-white p-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "⏳ Please Wait..." : "Calculate Default Risk"}
      </button>

      {/* Clear Button - shows only after result */}
      {result !== null && (
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-200 text-gray-700 p-4 rounded-xl font-semibold hover:bg-gray-300"
        >
          Clear Form
        </button>
      )}

    </div>

    {/* Result */}
    {result !== null && (
      <div className="bg-gray-50 border rounded-xl p-6 text-center space-y-4">

        <h2 className="text-xl font-semibold">Default Risk Score</h2>
        <p className="text-gray-500 text-sm">Probability of Loan Default</p>

        <p className="text-4xl font-bold text-indigo-600">
          {result.toFixed(2)}%
        </p>

        <div>
          {riskLevel === "LOW" && (
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              Low Risk
            </span>
          )}
          {riskLevel === "MEDIUM" && (
            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
              Medium Risk
            </span>
          )}
          {riskLevel === "HIGH" && (
            <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">
              High Risk
            </span>
          )}
        </div>

      </div>
    )}

  </div>
</div>
);
}

export default App;