import React,{useState,useEffect} from 'react'
import './App.css';
import { saveAs } from 'file-saver';
import exportFromJSON from 'export-from-json';
import Papa from 'papaparse';
import axios, { Axios } from 'axios'; 
import { Link } from 'react-router-dom';
import Details from './Details';
const Interface = () =>{

  const [datas,setDatas]=useState([]);
  const [file1,setFile1]=useState();
  const [out,setOut]=useState();
  const [irow,setIrow]=useState('');
  const [icol,setIcol]=useState('');
  const [frow,setFrow]=useState('');
  const [fcol,setFcol]=useState('');



  const exporting=()=>{
    const csvData = Papa.unparse(out);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'clean_data.csv');
  }

  const clean=(e)=>{
    let formdata={"data":datas}
    

  
    axios.post('http://localhost:5000/clean', formdata)
    .then(response => {
      console.log(response.data)
      setOut(response.data['data']);
      setFcol(response.data['fcol']);
      setIcol(response.data['icol']);
      setFrow(response.data['frow']);
      setIrow(response.data['irow']);
     
    })
    .catch(error => {
      console.error(error);
    });
      e.preventDefault();
  }

  const upload=()=>{
    Papa.parse(file1,{
      header:true,
      skipEmptyLines:true,
      complete:function(result){
        setDatas(result.data); 
      }
    })
  }

  const sendData=()=>{
    <Details initrow={irow}/>
  }



  return (
    <div className='content'>
      <h1 className='heading'>Dataset Cleaner</h1>
      <div className='frame'>
        <div className='InsideBox'>
          <div className='Part1'>
            <form onSubmit={clean}>
              <label>Upload the dataset</label>
              <br/>
              <input type="file" className='upload' accept='.csv' onChange={(e)=>{
                let file=e.target.files[0];
                setFile1(file);
                
              }}/> 
              <br/><br/>
              
              <button className='buttons1' type="submit">Start</button> 
            </form>
            <button className='buttons2' type='button' onClick={upload}>Upload</button>
            
          </div>
          {out&&<div className='Part2'>
           <button className='buttons3' type='button' onClick={exporting}>Download</button>
            <br/><br/><br/><br/><br/>
            <div className='shape'>
            <p className='output'>The shape of dataset before cleaning : {irow} x {icol}</p>
            <p className='output'>The shape of dataset after cleaning : {frow} x {fcol}</p>
            </div>  
            <Link to ="/details" target='_blank'><button className='buttons4' type='button' onClick={sendData}>Detailed Report</button></Link>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Interface
