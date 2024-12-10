import React from "react";
import { Link } from "react-router-dom";

export default function Card({ title, total, link, buttonText }) {
  return (
    <div className="card bg-neutral shadow-lg">
      <div className="card-body text-white">
        <h2 className="card-title">{title}</h2>
        <p>Total: {total}</p>
        <Link to={link} className="btn bg-red-500 hover:bg-red-700 text-white">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}