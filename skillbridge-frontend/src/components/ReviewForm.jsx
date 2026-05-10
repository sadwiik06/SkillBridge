import React, { useState } from 'react';
import API from '../api/axios';


const ReviewForm=({projectId,onReviewSubmitted})=>{
    const [rating,setRating]=useState(0);
    const [comment,setComment]=useState("");
    const [hover,setHover]=useState(0);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(rating === 0) return alert("Please select a star rating");
        try{
            await API.post(`/reviews/${projectId}`,{rating,comment});
            alert("Review submiteed!");
            onReviewSubmitted();
        } catch(err){
            alert("Error: "+(err.response?.data || "Could not save review"));

        }
    };
    return (
        <div>
            <h4>Rate the Freelancer</h4>
            <div>
                {[1,2,3,4,5].map((star)=>(
                    <span key={star}
                    style={{cursor:'pointer',color:(hover || rating)>=star?'#FFD700':'#ccc'}}
                    onClick={()=>setRating(star)}
                    onMouseEnter={()=>setHover(star)}
                    onMouseLeave={()=>setHover(0)}
                    >★</span>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                placeholder='Describe your experience working with this freelancer..'
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                required></textarea>
                <button type="submit">Submit Reviews</button>
            </form>
        </div>
    );
};

export default ReviewForm;