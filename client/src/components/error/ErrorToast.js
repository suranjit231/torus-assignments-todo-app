import React from 'react';
import style from './ErrorToast.module.css';
import { FaFaceSmileBeam } from "react-icons/fa6";

function ErrorToast() {


  return (
    <>
    <div className={style.errorContainer}>

        <FaFaceSmileBeam className={style.faceEmoji} />
    </div>

    <h3 className={style.notFoundHeading}>Not Found!</h3>
    
    </>
  )
}

export default ErrorToast;