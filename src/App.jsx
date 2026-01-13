import { use, useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

function App() {
  const patient_data = [{
    name:"Ram",
    age:"22",
    mobile:"7865463737",
    gender:"Male",
    doctor_name:"Avinash",
    visit_date:"20 oct 2025",
    visit_time:"6:45 PM",
    visit_type:"Consult"
  },
  {
    name:"Ravali",
    age:"30",
    mobile:"9876543210",
    gender:"Female",
    doctor_name:"Bharath",
    visit_date:"21 oct 2025",
    visit_time:"10:15 AM",
    visit_type:"Revisit"
  }
];
  //below are the toast message related useStates
const [toastText, setToastText] = useState('');
const [showToast, setShowToast] = useState(false);
const [toastType, setToastType] = useState('info'); 
const [pendingAction, setPendingAction] = useState(null);


  const[patient,update_patient]= useState(patient_data);
  const [editIndex, setEditIndex] = useState(null);

  //   below states is for to get input data from the user

  const[i_name,setName]= useState('');
  const[i_age,setAge]=useState('');
  const[i_mobile,setMobile]=useState('');
  const[i_gender,setGender]=useState('');
  const[i_doctor_name,setDoctorName]=useState('');
  const[i_visit_date,setVisitDate]=useState('');
  const[i_visit_time,setVisitTime]=useState('');
  const[i_visit_type,setVisitType]=useState('');

  const all_input_vals=[i_name,i_age,i_mobile,i_gender,i_doctor_name,i_visit_date,i_visit_time,i_visit_type];


  function formatTime(timeString){
                 // console.log(`${timeString} this is before format`)
                 if (!timeString) return '';
                      const [hour, minute] = timeString.split(':');
                      const h = parseInt(hour);
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const formattedHour = h % 12 || 12;
                  return `${formattedHour}:${minute} ${ampm}`;
            }
  function deFormatTime(timeString){ 
       if (!timeString) return '';
        timeString = timeString.trim();
        const parts = timeString.split(' ');
        const [hour, minute] = parts[0].split(':');
        const ampm = parts[1].toUpperCase();

        let h = parseInt(hour);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;

        return `${h}:${minute}`;
        
  }

function formatDate(dateString) {
  if (!dateString) return '';
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}


function deFormatDate(formattedDate) {
  if (!formattedDate) return '';
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };
  const parts = formattedDate.split(' ');
  const day = parts[0].padStart(2,'0'); 
  const month = months[parts[1]];
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

 function isValidPhone(phone) {
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(phone);
}


function isValidTime(timeString) {
  const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  return pattern.test(timeString.trim());
}


  const data_from_fields = () => {
  let isEmpty = false;

  all_input_vals.forEach((ele) => {
    if (ele.trim().length === 0) {
      isEmpty = true;
    }
  });

  if (isEmpty) {
    setToastText("All fields are required.");
    setToastType("info");
    setShowToast(true);
    return;
  }

  if (!isValidPhone(i_mobile)) {
    setToastText("Invalid phone number.");
    setToastType("info");
    setShowToast(true);
    return;
  }

  if (!isValidTime(i_visit_time)) {
    setToastText("Invalid time format.");
    setToastType("info");
    setShowToast(true);
    return;
  }

  const obj = {
    name: i_name,
    age: i_age,
    mobile: i_mobile,
    gender: i_gender,
    doctor_name: i_doctor_name,
    visit_date: formatDate(i_visit_date),
    visit_time: i_visit_time.trim(),
    visit_type: i_visit_type
  };

  if (editIndex !== null) {
    setToastText("Confirm update appointment?");
    setToastType("confirm");

    setPendingAction(() => () => {
      const updated = [...patient];
      updated[editIndex] = obj;
      update_patient(updated);
      setEditIndex(null);

      setName('');
      setMobile('');
      setGender('');
      setAge('');
      setDoctorName('');
      setVisitDate('');
      setVisitTime('');
      setVisitType('');

      setToastText("Appointment updated successfully!");
      setToastType("info");
      setShowToast(true);
    });

  } else {
    setToastText("Confirm booking appointment?");
    setToastType("confirm");

    setPendingAction(() => () => {
      update_patient([...patient, obj]);

      setName('');
      setMobile('');
      setGender('');
      setAge('');
      setDoctorName('');
      setVisitDate('');
      setVisitTime('');
      setVisitType('');

      setToastText("Appointment booked successfully!");
      setToastType("info");
      setShowToast(true);
    });
  }

  setShowToast(true);
  setShowAction(null);
};
    const[showAction,setShowAction] =useState(null);
    function handleAction(ind){
        setShowAction(showAction === ind ? null:ind);
    }
  const handleUpdate = (index) =>{
           
            const ele = patient[index];
            setName(ele.name);
            setAge(ele.age);
            setMobile(ele.mobile);
            setGender(ele.gender);
            setDoctorName(ele.doctor_name);
            setVisitDate(deFormatDate(ele.visit_date));
            setVisitType(ele.visit_type);
            setVisitTime(ele.visit_time);
            setEditIndex(index);
  }
   
  const handleDelete = (index) => {
      setToastText("Confirm delete appointment?");
      setToastType("confirm");
      
      
      setPendingAction(() => () => {
        const updated = patient.filter((_, ind) => ind !== index);
        update_patient(updated);
        setToastText("Appointment deleted successfully!");
        setToastType("info");
        setShowToast(true);
      });
      
      setShowToast(true); 
      setShowAction(null);
    };

  //       setName('');
  //       setAge('');
  //       setMobile('');
  //       setGender('');
  //       setDoctorName('');
  //       setVisitDate('');
  //       setVisitTime('');
  //       setVisitType('');
  //       setShowAction(null)
  // }
  return (
    <>
      <p>Welcome to Gradious Doctor Appointment Booking</p>
      {showToast && (
  <div className="toast-message">
    <p>{toastText}</p>

    {toastType === "confirm" ? (
      <div>
        <button
          className="toast-btns"
          style={{ backgroundColor: "grey" }}
          onClick={() => {
            setShowToast(false);
            setPendingAction(null);
          }}
        >
          Cancel
        </button>
        <button
          className="toast-btns"
          style={{ backgroundColor: "green" }}
          onClick={() => {
            if (pendingAction) pendingAction();
            setPendingAction(null);
          }}
        >
          Confirm
        </button>
      </div>
    ) : (
      <button
        className="toast-btns"
        style={{ backgroundColor: "blue" }}
        onClick={() => setShowToast(false)}
      >
        OK
      </button>
    )}
  </div>
)}

      <form className='form-container'>
          
          <input id='name' type='text' value={i_name} onChange={(e)=>setName(e.target.value)} placeholder='Patient Name*'></input>

          <input id='age' type='text' value={i_age} onChange={(e)=>setAge(e.target.value)} placeholder='Age*'></input>
         
          <input id='phone-number'value={i_mobile} type='text' onChange={(e)=>setMobile(e.target.value)} placeholder='Phone Number*'></input>

         <select id='gender' value={i_gender} onChange={(e)=>setGender(e.target.value)}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
          </select>

          <input id='dr-name' value={i_doctor_name} type='text' onChange={(e)=>setDoctorName(e.target.value)} placeholder='Doctor name*'></input>

          <input id='visit-date' value={i_visit_date} type='date' onChange={(e)=>setVisitDate(e.target.value)} placeholder='Visit Date*' />

          <input id="visit-time" type="text" value={i_visit_time}
                  onChange={(e) => setVisitTime(e.target.value)}
                    placeholder="Visit Time* (e.g., 9:30 AM)" />


         <select id='visit-type' value={i_visit_type} onChange={(e)=>setVisitType(e.target.value)}>
                <option value="">Visit Type</option>
                <option>Consult</option>
                <option>Revisit</option>
          </select>
          <br></br>
          <button id='book-btn' type='button' onClick={data_from_fields}>
                         {editIndex !== null ? "Update Appointment" : "Book Appointment"}
          </button>

    </form>
      <table className='table'>
            <thead>
                  <tr>				
                    <th>Patient</th>
                    <th>Status</th>
                    <th>Appointment</th>
                    <th>Phone</th>
                    <th>Doctor</th>
                    <th>Actions</th>
                  </tr>
            </thead>
            <tbody>
              {patient.map((ele,ind)=>(
                  <tr key={ind}>
                    <td><strong>{ele.name}</strong><br></br><p style={{margin:'0px',color:'gray'}}>{ele.age} yrs,{ele.gender}</p></td>
                    <td>
                      <button
  className="consult-btn"
  style={{
    backgroundColor:
      ele.visit_type === "Consult" ? "green" : "blue",
    color: "white"
  }}
>
  {ele.visit_type}
</button>
                      </td>
                    <td><strong>{ele.visit_time}</strong><br></br>{ele.visit_date}</td>
                    <td>{ele.mobile}</td>
                    <td>{ele.doctor_name}</td>
                    <td><FontAwesomeIcon id="action-btn" onClick={()=>handleAction(ind)} icon={faEllipsisVertical} style={{ color: "#06a0bbff" }} />
                    {showAction === ind && (
                        <div className="action-btn">
                          <button id="edit-btn" className='edit-btn update-acbtn' onClick={() => handleUpdate(ind)}>Edit</button><br></br>
                          <button id="delete-btn" className='delete-btn' onClick={() => handleDelete(ind)}>Delete</button>
                        </div>
                      )}</td>
                  </tr>
              ))}
                
              </tbody>     
      </table>
    </>
  )
}

export default App
