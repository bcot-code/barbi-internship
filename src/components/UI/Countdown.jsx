import React,{useEffect,useState} from "react";


const Countdown = ({expiryDate}) => {
    const [timeLeft, setTimeLeft] = useState("0h 0m 0s");

    const calculateTimeLeft = () => {
        if(!expiryDate) return "0h 0m 0s";
        const now = Date.now();
        const end = new Date(expiryDate).getTime();
        const diff = end - now;
        if(diff <= 0){
            return "0h 0m 0s";
        }
        const hours = Math.floor(diff/(1000 * 60 * 60));
        const minutes = Math.floor((diff/(1000 * 60)) % 60);
        const seconds = Math.floor((diff/1000) % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    useEffect(()=>{
        // Start timer immediately on mount
        setTimeLeft(calculateTimeLeft());

        if(!expiryDate) return;
        const timer = setInterval(() =>{
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return() => clearInterval(timer);
    }, [expiryDate]);

    return <span>{timeLeft}</span>

}
export default Countdown;
