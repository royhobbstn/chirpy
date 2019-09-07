import React from "react";

function Menu({ reloadData }) {
  return (
    <div className="menu">
      <div className="menu-container">
        <button className="menu-button" onClick={reloadData()}>
          Fetch New
        </button>
        <button
          className="menu-button float-right"
          onClick={function() {
            window.localStorage.clear();
            window.location.reload();
          }}
        >
          ReAuth
        </button>
      </div>
    </div>
  );
}

export default Menu;
