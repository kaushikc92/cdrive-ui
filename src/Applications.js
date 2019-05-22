import React from 'react';

const applications = {
  proClean: {
    displayName: "String Profiler and Cleaner",
    url: `http://0.0.0.0:8000/myapp/list/`,
    description: "Normalize attributes of a table and view table statistics"
  },
}

class Applications extends React.Component {
  render() {
    let links = Object.keys(applications).map((app, i) => (
      <li>
        <a href={applications[app]['url']}>{applications[app]['displayName']}</a>
      </li>
    ));
    return(
      <div className="applications-container" >
        <ul>
          {links}
        </ul>
      </div>
    );
  }
}

export default Applications;
