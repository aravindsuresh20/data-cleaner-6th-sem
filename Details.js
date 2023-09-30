import './Details.css';
import React,{useState,useEffect} from 'react';
import axios, { Axios } from 'axios'; 

const Details = ({initrow}) => {
  
  const [metrics,setMetrics]=useState('');
  const [irow,setIrow]=useState('');
  const [icol,setIcol]=useState('');
  const [frow,setFrow]=useState('');
  const [fcol,setFcol]=useState('');
  const [bias,setBias]=useState({});
  const [keys,setKeys]=useState([]);
  const [misscol,setMisscol]=useState([]);
  const [missrow,setMissrow]=useState('');
  const [duplirow,setDuplirow]=useState('');
  const [uniquecol,setUniquecol]=useState({});
  const [outrow,setOutrow]=useState('');
  const [unimpcol,setUnimpcol]=useState([]);
  const [p,setP]=useState("");

    useEffect(() => {
  
        axios.get('http://localhost:5000/detail')
        .then(response => {
          setMetrics(response.data['metrics']);
          setFcol(response.data['fcol']);
          setIcol(response.data['icol']);
          setFrow(response.data['frow']);
          setIrow(response.data['irow']);
          setBias(response.data['bias']);
          setMisscol(response.data['misscol']);
          setMissrow(response.data['missrow']);
          setDuplirow(response.data['duplirow']);
          setUniquecol(response.data['uniquecol']);
          setOutrow(response.data['outrow']);
          setUnimpcol(response.data['unimpcol']);
          setP(response.data['p']);

          console.log(response.data['misscol']);
        })
        .catch(error => {
          console.error(error);
        });
    },[]);

    useEffect(() => {
  
        setKeys(Object.keys(bias));
      
        }, [bias]);

    return( 

        <div className="contents">
          <h1 className='heading'>Detailed Report</h1>
           <div className="PartB">
          <div className='point'>
            <h3>Shape of the dataset</h3>
            <p className='outs'>The shape of dataset before cleaning : {irow} x {icol}</p>
            <p className='outs'>The shape of dataset after cleaning : {frow} x {fcol}</p>
          </div>

          {misscol.length!==0&&<div className='point'>
              <h3>Columns with missing values</h3>
              <div className='outs'>The columns with multiple missing values : {misscol.map((item, index) => (
                                                                                        <span key={index}>{item}</span>
                                                                                      ))}</div>
          </div>}

          <div className='point'>
            <h3>Missing values</h3>
            <p className='outs'>The number of rows with missing values : {missrow}</p>
          </div>
           
          <div className='point'>
            <h3>Duplicate rows</h3>
            <p className='outs'>The number of duplicate rows : {duplirow}</p>
          </div>

          {uniquecol.length!==0&&<div className='point'>
            <h3>Unique columns</h3>
            <p className='outs'>The less unique columns and very unique columns :  
                  <table  className="my-table">
                      <thead>
                        <tr>
                          <th>Columns</th>
                          <th>No. of unique values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(uniquecol).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
            
            </p>
          </div>}

          <div className='point'>
            <h3>Outliers</h3>
            <p className='outs'>The number of outliers : {outrow}</p>
          </div>

          {unimpcol.length!==0&&<div className='point'>
            <h3>Unimportant Features</h3>
            <div className='outs'>The unimportant features are : {unimpcol.map((item, index) => (
                                                                                        <span key={index}>{item}</span>
                                                                                      ))}</div>
          </div>}


          
          <div className='point'>
            <h3>Bias Information</h3>
           
            <p className='outs'>The Bias of the target is
            <table  className="my-table">
                      <thead>
                        <tr>
                          <th>Target</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(bias).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
                  </p>  
          </div>


            {/* <p className='output'>The Mean_Square_Error Score is : {metrics}</p>  */}
          <div className='point'>
            <h3>Metrics</h3>
            <p className='outs'>The r2 score of a Linear regression model trained on this dataset is : {metrics}</p>
          </div>     

            </div>
            
        </div>

     );
}
 
export default Details;