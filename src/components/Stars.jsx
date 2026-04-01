"use client";

import { useEffect, useState } from "react";

export default function Stars({ count = 60 }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setStars(
            Array.from({ length: count }, () => ({
                size: Math.random() * 2 + 1,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 3,
            }))
        );
    }, [count]);

    return (
        <div className="pointer-events-none absolute inset-0">
            {stars.map((s, i) => (
                <span
                    key={i}
                    className="star"
                    style={{
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}
