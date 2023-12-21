import React, { useState, useEffect } from "react";
import styles from "./ImageCarousel.module.css";
function ImageCarousel(props) {
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        if (props.imageData !== undefined) {
            const interval = setInterval(() => {
                setImageIndex((imageIndex + 1) % props.imageData.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    });

    if (props.imageData !== undefined) {
        return (
            <div>
                <img
                    className={styles.image}
                    src={
                        `http://localhost:4000` +
                        props.imageData[imageIndex].urls
                    }
                    alt="location"
                />
            </div>
        );
    }
}

export default ImageCarousel;
