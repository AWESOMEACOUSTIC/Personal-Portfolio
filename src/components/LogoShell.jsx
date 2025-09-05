"use client";
import React from "react";


export default function LogoShell({ children }) {
    return (
        <div className="min-h-[60vh] grid place-items-center bg-neutral-50 p-6">
            <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm">
                {children}
            </div>
        </div>
    );
}