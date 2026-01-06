import React,{useEffect,useState} from "react";


const Countdown = ({expiryDate}) => {
    const [timeLeft, setTimeLeft] = useState(" ");
   

    useEffect(()=>{
        if(!expiryDate) return;
        const timer = setInterval(() =>{
            const now = Date.now();
            const end = new Date(expiryDate).getTime();
            const diff = end - now;
            if(diff <= 0){
                clearInterval(timer);
                setTimeLeft("Ended");
                return;
            }
            const hours = Math.floor(diff/(1000 * 60 * 60));
            const minutes = Math.floor((diff/(1000 * 60)) % 60);
            const seconds = Math.floor((diff/1000) % 60);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            
        }, 1000);
        return() => clearInterval(timer); 
    }, [expiryDate]);

    return <div className="de_countdown">{timeLeft}</div>
    
}
export default Countdown;