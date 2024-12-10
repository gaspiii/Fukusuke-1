import React from "react";

export function Item( { name, price } ) {
    return (
        <div className="sushi">
            <input type="checkbox" id={ name } />
            <label htmlFor= { name }> { name } <p> { price } </p></label>
        </div>
    );
}