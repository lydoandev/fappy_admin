import React, {useState, useEffect} from 'react';

const Toast = (props) => {
    const [content, setcontent] = useState(props.content);
    useEffect(() => {
        if (content) {
            const timer = setTimeout(() => {
                setcontent("")
            }, 3000);
            return () => clearTimeout(timer);
        }
    })

    const closeToast = () => {
        setcontent("")
    }

    return (
        <div aria-live="polite" aria-atomic="true" className="d-flex main-toast justify-content-end align-items-center">
            <div className={content ? "toast show": "toast"} role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000">
                    <button type="button" className="m-2 close" data-dismiss="toast" aria-label="Close" onClick={closeToast}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                <div className="toast-body">
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Toast;