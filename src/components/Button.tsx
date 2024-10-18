import React from "react";

const Button = () => {

    return (
        <button type="submit" className={"p-4 rounded-full bg-blue-500 focus:outline-none btn"}>
            <i className="fa fa-play fa-2x text-white" id="play-btn"></i>
        </button>
    );

}

export default Button;