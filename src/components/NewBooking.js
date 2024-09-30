import React, { useState } from 'react';
import './NewBooking.css';
import { enqueueSnackbar } from 'notistack';

const AddBooking = ({ onClose }) => {
  const [formData, setFormData] = useState({
    branch: '',
    companyName: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    date: '',
    services: '',
    totalAmount: '',
    selectTerm: '',
    amount: '',
    paymentDate: '',
    pan: '',
    gst: '',
    notes: '',
    bank:'',
    status:''
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let validationErrors = {};
  
    // Branch validation
    if (!formData.branch) validationErrors.branch = "Branch is required";
  
    // Company Name validation
    if (!formData.companyName) validationErrors.companyName = "Company Name is required";
  
    // Contact Person validation
    if (!formData.contactPerson) validationErrors.contactPerson = "Contact Person is required";
  
    // Contact Number validation: must be exactly 10 digits, no spaces or special characters
    const contactNumberRegex = /^\d{10}$/;
    if (!formData.contactNumber || !contactNumberRegex.test(formData.contactNumber)) {
      validationErrors.contactNumber = "Valid Contact Number is required (10 digits, no spaces)";
    }
  
    // Email validation
    if (!formData.email) validationErrors.email = "Email is required";
  
    // Date validation
    if (!formData.date) validationErrors.date = "Date is required";
  
    // Total Amount validation: must be a valid number
    if (!formData.totalAmount || isNaN(formData.totalAmount)) {
      validationErrors.totalAmount = "Valid Total Amount is required";
    }
  
    // Select Term validation
    if (!formData.selectTerm) validationErrors.selectTerm = "Select Term is required";
  
    // Amount validation: must be a valid number
    if (!formData.amount || isNaN(formData.amount)) {
      validationErrors.amount = "Valid Amount is required";
    }
  
    // Payment Date validation
    if (!formData.paymentDate) validationErrors.paymentDate = "Payment Date is required";
  
    // PAN validation: must be exactly 10 characters (5 letters, 4 digits, 1 letter), no spaces or special characters
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.pan && !panRegex.test(formData.pan)) {
      validationErrors.pan = "Valid PAN is required (10 characters, no spaces, no special characters)";
    }
  
    // GST validation: must be 15 alphanumeric characters, no spaces or special characters
    const gstRegex = /^[A-Z0-9]{15}$/;
    if (!formData.gst) {
      validationErrors.gst = "GST is required";
    } else if (!gstRegex.test(formData.gst)) {
      validationErrors.gst = "Valid GST is required (15 alphanumeric characters, no spaces, no special characters)";
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const userSession = JSON.parse(localStorage.getItem('userSession'));

      if (userSession) {
        const dataToSubmit = {
          user_id: userSession.user_id,
          branch_name: formData.branch,
          company_name: formData.companyName.toUpperCase(),
          contact_person: formData.contactPerson,
          email: formData.email,
          contact_no: Number(formData.contactNumber),
          services: formData.services,
          total_amount: Number(formData.totalAmount),
          term_1: formData.selectTerm === "Term 1" ? Number(formData.amount) : null,
          term_2: formData.selectTerm === "Term 2" ? Number(formData.amount) : null,
          term_3: null,
          term_1_payment_date: formData.paymentDate,
          term_2_payment_date: null,
          term_3_payment_date: null,
          pan: formData.pan,
          gst: formData.gst,
          remark: formData.notes,
          date: new Date(formData.date.split('-').reverse().join('-')),
          bank:formData.bank,
          status:'Pending'
        };

        const apiEndpoint = 'https://crm-backend-6kqk.onrender.com/booking/addbooking';

        fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        })
        .then((response) => {
          // console.log(response)
        
          // return response.json()
          if(!response.ok){
            enqueueSnackbar(`Error creating booking`, { variant: 'error' });
          }else{
            enqueueSnackbar('Booking created successfully!', { variant: 'success' });
          }
         
          return response.json()
        }).then((res)=>{
          // Use notistack's success notification
          if (onClose) onClose(); // Close the form after submission

        })
        .catch((error) => {
          console.error('Error:', error);
          enqueueSnackbar(`Error creating booking: ${error.message}`, { variant: 'error' }); // Use notistack's error notification
        });
    } else {
      enqueueSnackbar('User session not found. Please log in again.', { variant: 'warning' }); // Use notistack's warning notification
    }
  }
};

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Create New Booking</h2>

      {/* Form input fields (keep them unchanged) */}
      <div className="form-group">
        <label>Branch</label>
        <select name="branch" value={formData.branch} onChange={handleChange}>
          <option value="">Select branch</option>
          <option>Branch A</option>
          <option>Branch B</option>
          <option>Branch C</option>
        </select>
        {errors.branch && <p className="error">{errors.branch}</p>}
      </div>
      
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />
        {errors.companyName && <p className="error">{errors.companyName}</p>}
      </div>

      <div className="form-group">
        <label>Contact Person Name</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person name"
        />
        {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter contact number"
        />
        {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
      </div>

      <div className="form-group">
        <label>Email ID</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email ID"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="dd-mm-yyyy"
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <label>Services</label>
        <select name="services" value={formData.services} onChange={handleChange}>
          <option value="">Select Service</option>
          <option value="MSME certificate">MSME certificate</option>
          <option value="GIG">GIG</option>
        </select>
        {errors.services && <p className="error">{errors.services}</p>}
      </div>

      <div className="form-group">
        <label>Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Enter total amount"
        />
        {errors.totalAmount && <p className="error">{errors.totalAmount}</p>}
      </div>

      <div className="form-group">
        <label>Select Term</label>
        <select name="selectTerm" value={formData.selectTerm} onChange={handleChange}>
          <option value="">Select Term</option>
          <option>Term 1</option>
          <option>Term 2</option>
        </select>
        {errors.selectTerm && <p className="error">{errors.selectTerm}</p>}
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount after fund disbursement"
        />
        {errors.amount && <p className="error">{errors.amount}</p>}
      </div>

      <div className="form-group">
        <label>Payment Date</label>
        <input
          type="text"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          placeholder="Enter Date"
        />
        {errors.paymentDate && <p className="error">{errors.paymentDate}</p>}
      </div>

      <div className="form-group">
  <label>PAN</label>
  <input
    type="text"
    name="pan"
    value={formData.pan}
    onChange={handleChange}
    placeholder="Enter PAN"
  />
  {errors.pan && <p className="error">{errors.pan}</p>} {/* Display the PAN error */}
</div>

<div className="form-group">
  <label>GST</label>
  <input
    type="text"
    name="gst"
    value={formData.gst}
    onChange={handleChange}
    placeholder="Enter GST"
  />
  {errors.gst && <p className="error">{errors.gst}</p>} {/* Display the GST error */}
</div>
      <div className="form-group">
        <label>Bank Name</label>
        <input
          type="text"
          name="bank"
          value={formData.bank}
          onChange={handleChange}
          placeholder="Enter company name"
        />
        {errors.bank && <p className="error">{errors.bank}</p>}
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any notes"
          rows="3"
        ></textarea>
      </div>

      <button className="submit-btn" type="submit">Submit</button>
    </form>
  );
};

export default AddBooking;
