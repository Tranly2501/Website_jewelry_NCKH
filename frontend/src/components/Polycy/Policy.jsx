import React from "react";
import "../Polycy/Policy.css";
import "../../index.css";
import Ship from "../../assets/shipping.svg"
import Refresh from "../../assets/mdi-light_refresh.svg";
import Support from "../../assets/Group 13.svg"
import Quality from "../../assets/Group 15.svg"

const Policy = () => {
return (<>
<div className =" policy-container">
    <div className="item">
        <img src={Ship} alt="Miễn phí ship" />
        Miễn phí ship
    </div>
    <div className="item">
        <img src={Refresh} alt="" />
        Hoàn trả 100%
    </div>
    <div className="item">
        <img src={Support} alt="" />
        Hỗ trợ 24/7
    </div>
    <div className="item">
        <img src={Quality} alt="" />
        Chất lượng uy tín
    </div>
</div>
</>
)
} 
export default Policy;