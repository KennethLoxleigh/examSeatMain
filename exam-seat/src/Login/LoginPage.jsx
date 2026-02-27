import style from './LoginPage.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

function LoginPage () {
    
    return (
        <>
        <div className={style.head}>
            <FontAwesomeIcon icon={faGraduationCap} className={style.logo}/>
            <h1>EXAM SEATING ARRANGEMENT SYSTEM</h1>
        </div>
        <div className={style.cardWrapper}>
            <div className={style.entryCard}>
                <h2>LOG IN AS</h2>  
                <button>ADMIN</button>
                <button>INVIGILATOR</button>
                <button>STUDENT</button>
            </div>
        </div>
        </>
    );
}

export default LoginPage;