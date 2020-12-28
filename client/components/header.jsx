import React from 'react';

export default function Header(props) {
  return (
    <header>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Earth</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fas fa-bars menu-icon"></i></a>
              <ul className="dropdown-menu">
                <li><a href="#">Create a Post</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
