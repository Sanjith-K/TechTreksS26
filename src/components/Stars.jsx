"use client";

import { useEffect, useState } from "react";

export default function Stars({ count = 70 }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setStars(
            Array.from({ length: count }, () => ({
                size: Math.random() * 2 + 1,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 3,
                opacity: Math.random() * 0.5 + 0.35,
            }))
        );
    }, [count]);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {stars.map((s, i) => (
                <span
                    key={i}
                    className="star absolute rounded-full bg-white"
                    style={{
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        opacity: s.opacity,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}