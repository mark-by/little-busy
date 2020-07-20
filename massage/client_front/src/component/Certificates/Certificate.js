import React from "react";

function Certificate({image}, ref) {
    const [opened, toggle] = React.useState(false);

    return (
        <>
            {opened && <div className="opened-certificate-wrapper" onClick={() => toggle(false)}><img src={image} alt="certificate"/></div>}
            <div ref={ref} className="certificate" onClick={() => toggle(true)}>
                <img className="certificate__image" src={"/resize-img/w500/" + image} alt={"сертификат"}/>
            </div>
        </>
    )
}

export default React.forwardRef(({image}, ref) => Certificate({image}, ref))